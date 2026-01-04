import type React from "react"
import { useState } from "react"
import { sendClientInvite } from "../services/api"
import type { ClientInvite } from "../types/clientTypes"
import { useNavigate } from "react-router"

function InviteClientPage() {
	const [clientData, setClientData] = useState<ClientInvite>({
		email: ""
	})
	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			const response = await sendClientInvite(clientData)
			navigate('/dashboard')
			return response
		} catch (error) {
			console.error("Error inviting client:", error)
		}
	}

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target
		setClientData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<div className="flex justify-center items-center p-6">
			<div className="w-full max-w-md shadow-xl rounded-xl bg-surface border border-border-light p-8">

				<div className="text-center mb-6">
					<h1 className="text-2xl font-bold text-text-dark mb-2">הזמנת מתאמן</h1>
					<p className="text-sm text-text-light">הזן אימייל לשליחת הזמנה</p>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<input
						onChange={handleInputChange}
						name="email"
						type="email"
						placeholder="client@example.com"
						className="w-full px-4 py-3 rounded-lg border border-border-medium bg-white focus:border-trainer-primary outline-none transition text-text-dark placeholder:text-text-lighter"
						required
						autoFocus
					/>

					<button
						type="submit"
						className="px-6 py-2 rounded-lg bg-primary-button hover:brightness-90 text-white font-semibold transition shadow-md self-end"
					>
						שלח הזמנה
					</button>
				</form>
			</div>
		</div>
	)
}

export default InviteClientPage
