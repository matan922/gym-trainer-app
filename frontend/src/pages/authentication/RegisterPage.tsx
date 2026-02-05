import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { useSignUp, useAuth } from "@clerk/clerk-react"
import { useMutation } from "@tanstack/react-query"
import { createProfile, syncUser } from "../../services/authApi"
import { useAuthStore } from "../../store/authStore"
import RoleSelectionView from "../../components/authentication/RoleSelectionView"
import Register from "../../components/authentication/Register"
import type { RegisterData } from "../../types/clientTypes"
import VerifyCodeComponent from "../../components/authentication/VerifyCodeComponent"

const RegisterPage = () => {
	const { signUp, isLoaded, setActive } = useSignUp()
	const { getToken } = useAuth()
	const setToken = useAuthStore((state) => state.setToken)
	const setUser = useAuthStore((state) => state.setUser)
	const [isVerifying, setIsVerifying] = useState<boolean>(false)
	const [registerData, setRegisterData] = useState<RegisterData>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		age: "",
		weight: "",
		goal: "",
		notes: "",
		profileType: null,
		inviteToken: ""
	})
	const [error, setError] = useState<string>()
	const [registerType, setRegisterType] = useState<"trainer" | "client" | null>(null)
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	// checks if there is pending invite token from a trainer
	const pendingToken = searchParams.get('token')
	const hasPendingInvite = Boolean(pendingToken)
	useEffect(() => {
		if (!pendingToken) return // if none return and continue registration normally

		// Automatically set to client registration
		setRegisterType("client")
		setRegisterData(prev => ({ ...prev, profileType: "client", inviteToken: pendingToken }))
	}, [pendingToken])

	// Restore verification state from localStorage on mount
	useEffect(() => {
		const pendingVerification = localStorage.getItem('pendingVerification')
		if (pendingVerification) {
			try {
				const data = JSON.parse(pendingVerification)
				setRegisterData(data.registerData)
				setRegisterType(data.registerType)
				setIsVerifying(true)
			} catch (error) {
				console.error('Failed to restore verification state:', error)
				localStorage.removeItem('pendingVerification')
			}
		}
	}, [])

	const handleRegisterTypeChange = (type: "trainer" | "client" | null) => {
		setRegisterType(type)
		setRegisterData({ ...registerData, profileType: type })
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.currentTarget
		setRegisterData({ ...registerData, [name]: value })
	}

	// Mutation 1: Create MongoDB profile
	const createProfileMutation = useMutation({
		mutationFn: createProfile,
		onSuccess: async (data) => {
			if (!data.success) {
				setError(data.message)
				return
			}
			// Profile created, now sync to get full user data
			syncUserMutation.mutate()
		},
		onError: (err: any) => {
			setError(err.message || "Failed to create profile")
		}
	})

	// Mutation 2: Sync user data
	const syncUserMutation = useMutation({
		mutationFn: syncUser,
		onSuccess: (data) => {
			if (!data.success) {
				setError(data.message)
				return
			}
			setUser(data.user)
			navigate('/dashboard')
		},
		onError: (err: any) => {
			setError(err.message || "Failed to sync user data")
		}
	})

	const handleVerifyCode = async (code: string) => {
		try {
			setError(undefined)
			const result = await signUp.attemptEmailAddressVerification({ code })
			console.log(result)

			if (result.status === "complete") {
				// Clear localStorage
				localStorage.removeItem('pendingVerification')

				// Set active session
				await setActive({ session: result.createdSessionId })

				// Get and store Clerk token
				const clerkToken = await getToken()
				if (clerkToken) {
					setToken(clerkToken)
				}

				// Create MongoDB profile
				createProfileMutation.mutate({
					firstName: registerData.firstName,
					lastName: registerData.lastName,
					email: registerData.email,
					profileType: registerData.profileType!,
					age: registerData.age,
					weight: registerData.weight,
					goal: registerData.goal,
					notes: registerData.notes,
					trainerType: registerData.profileType === 'trainer' ? 'personal' : undefined,
					inviteToken: registerData.inviteToken
				})
			}
		} catch (err: any) {
			console.error('Verification error:', err)
			setError("קוד לא תקין. נסה שוב")
		}
	}

	const handleResendCode = async () => {
		try {
			setError(undefined)
			const resent = await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
			console.log(resent)
			setError("קוד חדש נשלח למייל שלך")
		} catch (err: any) {
			console.error('Resend error:', err)
			setError("שגיאה בשליחת הקוד. נסה שוב")
		}
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(undefined)
		if (!isLoaded) return

		try {
			// 1. Sign up with Clerk
			const result = await signUp.create({
				emailAddress: registerData.email,
				password: registerData.password,
				firstName: registerData.firstName,
				lastName: registerData.lastName,
			})

			console.log('Signup status:', result.status)

			if (result.status === "missing_requirements") {
				// 2. Email verification required
				const codeSent = await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
				console.log("CODE THAT WAS SENT = ",codeSent)
				// Save to localStorage
				localStorage.setItem('pendingVerification', JSON.stringify({
					registerData,
					registerType
				}))

				setIsVerifying(true)
				setError("נשלח קוד אימות למייל שלך. בדוק את תיבת הדואר הנכנס")

			} else if (result.status === "complete") {
				// 3. Email already verified (test mode or no verification required)
				await setActive({ session: result.createdSessionId })

				// 4. Get and store Clerk token
				const clerkToken = await getToken()
				if (clerkToken) {
					setToken(clerkToken)
				}

				// 5. Create MongoDB profile with business data
				createProfileMutation.mutate({
					firstName: registerData.firstName,
					lastName: registerData.lastName,
					email: registerData.email,
					profileType: registerData.profileType!,
					age: registerData.age,
					weight: registerData.weight,
					goal: registerData.goal,
					notes: registerData.notes,
					trainerType: registerData.profileType === 'trainer' ? 'personal' : undefined,
					inviteToken: registerData.inviteToken
				})
			}
		} catch (err: any) {
			console.error("Error:", err)

			// Check if email already exists (might be unverified account)
			if (err.errors?.[0]?.code === "form_identifier_exists") {
				try {
					// Email exists - let user try verification
					await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

					localStorage.setItem('pendingVerification', JSON.stringify({
						registerData,
						registerType
					}))

					setIsVerifying(true)
					setError("כבר נרשמת! נשלח קוד אימות למייל שלך")
				} catch (resendErr) {
					setError("אימייל כבר קיים במערכת")
				}
			} else {
				setError(err.errors?.[0]?.message || "הרשמה נכשלה")
			}
		}
	}

	const handleBack = () => {
		// Don't allow going back if there's a pending invite
		if (hasPendingInvite) return

		setRegisterType(null)
	}

	return (
		<div className={`min-h-screen flex items-center justify-center ${registerType === null ? "bg-sunset" : registerType === "trainer" ? "bg-trainer" : "bg-client"} p-4`}>
			{!registerType ? (
				<RoleSelectionView roleChange={handleRegisterTypeChange} />
			) : isVerifying ? (
				<VerifyCodeComponent
					email={registerData.email}
					onVerify={handleVerifyCode}
					onResend={handleResendCode}
					error={error}
					isLoading={createProfileMutation.isPending || syncUserMutation.isPending}
				/>
			) : (
				<Register
					registerData={registerData}
					onInputChange={handleInputChange}
					onSubmit={handleSubmit}
					registerType={registerType}
					onBack={handleBack}
					hasPendingInvite={hasPendingInvite}
					error={error}
				/>
			)}
		</div>
	)


}

export default RegisterPage
