import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { register } from "../../services/api"

interface registerData {
	firstName: string
	lastName: string
	email: string
	password: string
}

const RegisterPage = () => {
	const [registerData, setRegisterData] = useState<registerData>({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	})
	const [error, setError] = useState<string>()
	const navigate = useNavigate()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget
		setRegisterData({ ...registerData, [name]: value })
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const response = await register(registerData)

		if (!response.success) {
			setError(response.message)
			return
		}

		navigate('/')
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">יצירת חשבון</h1>
					<p className="text-gray-600">הירשם למערכת</p>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="firstName"
							className="block text-sm font-medium text-gray-700 mb-2 text-right"
						>
							שם פרטי
						</label>
						<input
							onChange={handleInputChange}
							name="firstName"
							id="firstName"
							type="text"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
							placeholder="שם פרטי"
						/>
					</div>

					<div>
						<label
							htmlFor="lastName"
							className="block text-sm font-medium text-gray-700 mb-2 text-right"
						>
							שם משפחה
						</label>
						<input
							onChange={handleInputChange}
							name="lastName"
							id="lastName"
							type="text"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
							placeholder="שם משפחה"
						/>
					</div>

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
						הירשם
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-gray-600 text-sm">
						כבר יש לך חשבון?{" "}
						<Link
							to={"/"}
							className="text-indigo-600 hover:text-indigo-700 font-medium"
						>
							התחבר כאן
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default RegisterPage
