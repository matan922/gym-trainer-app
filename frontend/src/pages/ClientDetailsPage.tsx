import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import ClientEdit from "../components/client/ClientEdit"
import DeleteClientButton from "../components/client/DeleteClientButton"
import { getClient, putClient } from "../services/api"
import type { Client } from "../types/clientTypes"

const ClientDetailsPage = () => {
	const [client, setClient] = useState<Client | null>(null)
	const [clientId, setClientId] = useState<string>('')
	const { id } = useParams()
	const navigate = useNavigate()
	const [editMode, setEditMode] = useState<boolean>(false)

	useEffect(() => {
		const getClientData = async () => {
			try {
				if (id) {
					const response = await getClient(id)
					console.log(response.data.client.profiles.client)
					setClient(response.data.client.profiles.client)
					setClientId(response.data.client._id)
				}
			} catch (error) {
				console.error("Error fetching client:", error)
			}
		}

		getClientData()
	}, [id])

	const handleEdit = () => {
		setEditMode(!editMode)
	}

	const handleSubmit = async (editData: Client) => {
		try {
			if (editData?._id) {
				const response = await putClient(editData, editData._id)
				setClient(response.data.client) // Update the client state with new data
				handleEdit()
				return response.data.success
			}
		} catch (error) {
			console.error("Error creating client:", error)
		}
	}

	if (!client) return <div>לקוח לא נמצא</div>

	// TODO FUTURE: PUT IT ALL IN COMPONENTS
	return (
		<div className="min-h-screen bg-trainer p-4 lg:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 lg:p-8">
					{/* Header */}
					<div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-trainer-primary/20">
						<div className="flex items-center gap-3">
							<span className="text-4xl">👤</span>
							<h1 className="text-3xl lg:text-4xl font-bold text-trainer-dark">
								{client.firstName} {client.lastName}
							</h1>
						</div>
						<button
							type="button"
							onClick={handleEdit}
							className="px-4 py-2 rounded-lg bg-trainer-primary hover:bg-trainer-dark text-white font-semibold shadow-md transition-all"
						>
							{editMode ? "ביטול" : "✏️ עריכה"}
						</button>
					</div>

					{editMode ? (
						<ClientEdit
							editMode={handleEdit}
							onSubmit={handleSubmit}
							client={client}
						/>
					) : (
						<>
							{/* Client Info */}
							<div className="flex flex-col gap-4 mb-6">
								{/* Age Card */}
								<div className="flex items-center gap-3 p-4 bg-white rounded-lg border-r-4 border-trainer-primary">
									<span className="text-2xl">📅</span>
									<div className="flex flex-col gap-1 flex-1">
										<span className="text-sm text-text-medium font-medium">גיל</span>
										<span className="text-lg font-bold text-trainer-primary">{client.age}</span>
									</div>
								</div>

								{/* Weight Card */}
								<div className="flex items-center gap-3 p-4 bg-white rounded-lg border-r-4 border-trainer-primary">
									<span className="text-2xl">⚖️</span>
									<div className="flex flex-col gap-1 flex-1">
										<span className="text-sm text-text-medium font-medium">משקל</span>
										<span className="text-lg font-bold text-trainer-primary">{client.weight} ק"ג</span>
									</div>
								</div>

								{/* Goal Card */}
								<div className="flex items-center gap-3 p-4 bg-white rounded-lg border-r-4 border-trainer-primary">
									<span className="text-2xl">🎯</span>
									<div className="flex flex-col gap-1 flex-1">
										<span className="text-sm text-text-medium font-medium">מטרה</span>
										<span className="text-lg font-bold text-trainer-primary">{client.goal}</span>
									</div>
								</div>

								{/* Notes Card */}
								{client.notes && (
									<div className="flex items-start gap-3 p-4 bg-white rounded-lg border-r-4 border-trainer-primary">
										<span className="text-2xl">📝</span>
										<div className="flex flex-col gap-1 flex-1">
											<span className="text-sm text-text-medium font-medium">הערות</span>
											<p className="text-base text-text-dark text-right">{client.notes}</p>
										</div>
									</div>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-4 border-t-2 border-trainer-primary/20">
								<button
									type="button"
									onClick={() => {
										navigate(`/dashboard/clients/${clientId}/workouts`)
									}}
									className="flex-1 flex items-center justify-center gap-2 bg-trainer-primary hover:bg-trainer-dark text-white py-3 px-4 rounded-lg font-semibold shadow-md transition-all"
								>
									<span className="text-xl">📅</span>
									תוכניות
								</button>
								<button
									type="button"
									onClick={() => {
										navigate(`/dashboard/sessions/${clientId}`)
									}}
									className="flex-1 flex items-center justify-center gap-2 bg-trainer-primary hover:bg-trainer-dark text-white py-3 px-4 rounded-lg font-semibold shadow-md transition-all"
								>
									<span className="text-xl">💪</span>
									פגישות
								</button>
								<DeleteClientButton
									onDelete={() => navigate("/dashboard")}
									clientId={clientId!}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default ClientDetailsPage
