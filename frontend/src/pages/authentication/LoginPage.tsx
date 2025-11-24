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
	const token = useAuthStore((state) => state.token)
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
		const loginData = await login(userData)
		setToken(loginData.accessToken)
		navigate("/dashboard")
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						ברוכים השבים
					</h1>
					<p className="text-gray-600">התחבר לחשבון שלך</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-2 text-right"
						>
							אימייל
						</label>
						<input
							onChange={handleInputChange}
							name="email"
							id="email"
							type="email"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
							placeholder="your@email.com"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-2 text-right"
						>
							סיסמה
						</label>
						<input
							onChange={handleInputChange}
							name="password"
							id="password"
							type="password"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
					>
						התחבר
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-gray-600 text-sm">
						עדיין אין לך חשבון?{" "}
						<Link
							to="/register"
							className="text-indigo-600 hover:text-indigo-700 font-medium"
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
