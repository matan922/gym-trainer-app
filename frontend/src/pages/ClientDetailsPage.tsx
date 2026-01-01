import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import ClientEdit from "../components/client/ClientEdit"
import DeleteClientButton from "../components/client/DeleteClientButton"
import { getClient, putClient } from "../services/api"
import type { Client } from "../types/clientTypes"

const ClientDetailsPage = () => {
	const [client, setClient] = useState<Client | null>(null)
	const { id } = useParams()
	const navigate = useNavigate()
	const [editMode, setEditMode] = useState<boolean>(false)

	useEffect(() => {
		const getClientData = async () => {
			try {
				if (id) {
					const response = await getClient(id)
					setClient(response.data.client)
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
		<div className="p-8 w-full flex flex-col items-center">
			<div className="max-w-lg w-full">
				<div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-bold text-gray-800">
							{client.firstName} {client.lastName}
						</h1>
						<button
							type="button"
							onClick={handleEdit}
							className="px-4 py-2 rounded shadow bg-blue-500 hover:bg-blue-600 text-white transition-colors"
						>
							{editMode ? "ביטול" : "עריכה"}
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
							<div className="flex flex-col gap-3 text-gray-700">
								<div className="flex gap-2">
									<span className="font-semibold">גיל:</span>
									<span>{client.age}</span>
								</div>
								<div className="flex gap-2">
									<span className="font-semibold">משקל:</span>
									<span>{client.weight} ק"ג</span>
								</div>
								<div className="flex gap-2">
									<span className="font-semibold">מטרה:</span>
									<span>{client.goal}</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="font-semibold">הערות:</span>
									<span className="text-gray-600">{client.notes}</span>
								</div>
							</div>

							<div className="flex gap-3 pt-4 border-t border-gray-200">
								<button
									type="button"
									onClick={() => {
										navigate(`/dashboard/clients/${client._id}/workouts`)
									}}
									className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded shadow transition-colors"
								>
									אימונים
								</button>
								<DeleteClientButton
									onDelete={() => navigate("/dashboard")}
									clientId={client._id!}
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
