import { useState, useEffect } from "react"
import { useSignIn, useAuth } from "@clerk/clerk-react"
import { Link, useNavigate } from "react-router"
import { useAuthStore } from "../../store/authStore"
import { syncUser, acceptInviteAuthenticated } from "../../services/authApi"
import { useMutation } from "@tanstack/react-query"

const LoginPage = () => {
	const { signIn, isLoaded, setActive } = useSignIn()
	const { isSignedIn, isLoaded: isAuthLoaded } = useAuth()
	const setUser = useAuthStore((state) => state.setUser)
	const [error, setError] = useState<string>("")
	const [userData, setUserData] = useState({
		email: "",
		password: "",
	})
	const navigate = useNavigate()

	// Redirect if already signed in with user data (e.g., direct URL access to /login)
	useEffect(() => {
		if (isAuthLoaded && isSignedIn && useAuthStore.getState().user) {
			console.log("nav")
			navigate("/dashboard", { replace: true })
		}
	}, [isAuthLoaded, isSignedIn, navigate])

	// React Query mutation for syncing MongoDB user with retry logic
	const syncUserMutation = useMutation({
		mutationFn: syncUser,
		// retry: (failureCount, error: any) => {
		// 	// Retry up to 3 times, but only for auth errors (token not ready)
		// 	if (error.message?.includes("Unauthorized") && failureCount < 3) {
		// 		return true
		// 	}
		// 	return false
		// },
		// retryDelay: (attemptIndex) => {
		// 	// Exponential backoff: 200ms, 400ms, 800ms
		// 	return Math.min(1000, 200 * Math.pow(2, attemptIndex))
		// },
		onSuccess: async (data) => {
			if (!data.success) {
				setError(data.message || "Failed to sync user")
				return
			}

			// Store MongoDB user in zustand
			setUser(data.user)

			// Check for pending invite token
			const pendingToken = localStorage.getItem("pendingInviteToken")
			if (pendingToken) {
				try {
					const inviteResponse = await acceptInviteAuthenticated(pendingToken)
					if (inviteResponse.success) {
						localStorage.removeItem("pendingInviteToken")
						console.log("הצטרפת בהצלחה למאמן!")
					}
				} catch (error) {
					console.error("Error accepting invite:", error)
				}
			}

			navigate("/dashboard")
		},
		onError: (err: any) => {
			setError(err.message || "Failed to sync with server")
		}
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setUserData({ ...userData, [name]: value })
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError("")

		if (!isLoaded) return

		try {
			// 1. Sign in with Clerk
			const result = await signIn.create({
				identifier: userData.email,
				password: userData.password,
			})
			
			if (result.status === "complete") {
				// 2. Set the active Clerk session
				console.log("is it true already? (before setactive)",isSignedIn)
				await setActive({ session: result.createdSessionId })
				console.log("is it true after setactive?",isSignedIn)

				// 3. Sync with MongoDB (component stays mounted now!)
				syncUserMutation.mutate()
			}
		} catch (err: any) {
			console.error("Error:", err)
			setError(err.errors?.[0]?.message || "התחברות נכשלה")
		}
	}

	const isLoading = !isLoaded || syncUserMutation.isPending

	return (
		<div className="min-h-screen flex items-center justify-center bg-sunset">
			<div className="bg-surface p-10 rounded-3xl shadow-2xl w-full max-w-md">
				<div className="text-center mb-8 flex flex-col gap-2">
					<h1 className="text-4xl font-bold text-text-dark">
						ברוכים השבים
					</h1>
					<p className="text-text-medium font-medium text-lg">התחבר לחשבון שלך</p>
				</div>

				{error && (
					<div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-text-medium mb-2 text-right"
						>
							אימייל
						</label>
						<input
							onChange={handleInputChange}
							name="email"
							id="email"
							type="email"
							disabled={isLoading}
							className="w-full px-4 py-3 border border-border-medium rounded-lg focus:ring-2 focus:ring-client-primary focus:border-transparent outline-none transition disabled:opacity-50"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-text-medium mb-2 text-right"
						>
							סיסמה
						</label>
						<input
							onChange={handleInputChange}
							name="password"
							id="password"
							type="password"
							disabled={isLoading}
							className="w-full px-4 py-3 border border-border-medium rounded-lg focus:ring-2 focus:ring-client-primary focus:border-transparent outline-none transition disabled:opacity-50"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full text-white py-3 rounded-lg font-semibold transition duration-200 shadow-xl bg-primary-button hover:bg-primary-button-hover disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "מתחבר..." : "התחבר"}
					</button>
				</form>

				<div className="mt-6 text-center pt-4 border-t border-border-light">
					<p className="text-text-light">
						עדיין אין לך חשבון?{" "}
						<Link
							to="/register"
							className="text-primary hover:text-primary-dark font-semibold"
						>
							הירשם כעת
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default LoginPage
