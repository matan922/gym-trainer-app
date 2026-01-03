import { useState } from "react"
import { login } from "../../services/api"
import { Link, useNavigate } from "react-router"
import { useAuthStore } from "../../store/authStore"

interface User {
	email: string
	password: string
}

const LoginPage = () => {
	const setToken = useAuthStore((state) => state.setToken)
	const [userData, setUserData] = useState<User>({
		email: "",
		password: "",
	})
	const navigate = useNavigate()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setUserData({ ...userData, [name]: value })
	}

	const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
		e.preventDefault()
		const response = await login(userData)
		console.log(response)
		setToken(response.accessToken)
		navigate("/dashboard")
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-sunset">
			<div className="bg-surface p-10 rounded-3xl shadow-2xl w-full max-w-md">
				<div className="text-center mb-8 flex flex-col gap-2">
					<h1 className="text-4xl font-bold text-text-dark">
						ברוכים השבים
					</h1>
					<p className="text-text-medium font-medium text-lg">התחבר לחשבון שלך</p>
				</div>

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
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-client-primary focus:border-transparent outline-none transition"
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
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-client-primary focus:border-transparent outline-none transition"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						className="w-full text-white py-3 rounded-lg font-semibold transition duration-200 shadow-xl bg-primary-button hover:bg-primary-button-hover"
					>
						התחבר
					</button>
				</form>

				<div className="mt-6 text-center pt-4 border-t border-gray-100">
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
