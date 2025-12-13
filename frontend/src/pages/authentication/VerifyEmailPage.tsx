import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router"
import axios from "axios"

function VerifyEmailPage() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
	const [message, setMessage] = useState("")

	useEffect(() => {
		const verifyEmail = async () => {
			const token = searchParams.get("token")

			if (!token) {
				setStatus("error")
				setMessage("אסימון חסר")
				return
			}

			try {
				const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"
				const response = await axios.post(`${apiUrl}/auth/verify-email`, { token })

				if (response.data.success) {
					setStatus("success")
					setMessage("האימייל אומת בהצלחה! מעביר להתחברות...")
					setTimeout(() => navigate("/login"), 2000)
				} else {
					setStatus("error")
					setMessage(response.data.message || "שגיאה באימות")
				}
			} catch (error: any) {
				setStatus("error")
				setMessage(error.response?.data?.message || "שגיאה באימות האימייל")
			}
		}

		verifyEmail()
	}, [searchParams, navigate])

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
				<div className="text-center">
					{status === "loading" && (
						<>
							<div className="text-4xl mb-4">⏳</div>
							<h1 className="text-2xl font-bold mb-2">מאמת אימייל...</h1>
						</>
					)}

					{status === "success" && (
						<>
							<div className="text-4xl mb-4">✅</div>
							<h1 className="text-2xl font-bold mb-2 text-green-600">הצלחה!</h1>
							<p className="text-gray-600">{message}</p>
						</>
					)}

					{status === "error" && (
						<>
							<div className="text-4xl mb-4">❌</div>
							<h1 className="text-2xl font-bold mb-2 text-red-600">שגיאה</h1>
							<p className="text-gray-600 mb-4">{message}</p>
							<button
								onClick={() => navigate("/login")}
								className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							>
								חזור להתחברות
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default VerifyEmailPage
