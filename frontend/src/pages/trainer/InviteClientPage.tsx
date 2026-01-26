import type React from "react"
import { useState } from "react"
import { sendClientInvite } from "../../services/authApi"
import type { ClientInvite } from "../../types/clientTypes"
import { useNavigate } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

function InviteClientPage() {
	const queryClient = useQueryClient()
	const [clientData, setClientData] = useState<ClientInvite>({
		email: ""
	})
	const navigate = useNavigate()
	const sendInviteMutation = useMutation({
		mutationFn: (clientData: ClientInvite) => sendClientInvite(clientData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['clients'] }) // check if fine
			navigate('/dashboard')
		},
		onError: (error) => {
			console.log(error)
		}

	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		sendInviteMutation.mutate(clientData)
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

	const sendInvitePendingDisabledStyle = sendInviteMutation.isPending ? "disabled disabled:bg-trainer-disabled-bg disabled:text-trainer-disabled-text disabled:border-trainer-disabled-border disabled:cursor-not-allowed" : ""
	return (
		<div className="flex justify-center items-center p-6" >
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
						disabled={sendInviteMutation.isPending}
						className={`px-6 py-2 rounded-lg bg-primary-button hover:brightness-90 text-white font-semibold transition shadow-md self-end ${sendInvitePendingDisabledStyle}`}
					>
						שלח הזמנה
					</button>
				</form>
			</div>
		</div >
	)
}

export default InviteClientPage
