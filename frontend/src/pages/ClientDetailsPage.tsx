import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import ClientEdit from "../components/client/ClientEdit"
import { fetchClient, putClient } from "../services/api"
import type { Client } from "../types/clientTypes"
import DeleteClientButton from "../components/client/DeleteClientButton"

const ClientDetailsPage = () => {
	const [client, setClient] = useState<Client | null>(null)
	const { id } = useParams()
	const navigate = useNavigate()
	const [editMode, setEditMode] = useState<boolean>(false)

	useEffect(() => {
		const getClientData = async () => {
			try {
				if (id) {
					const response = await fetchClient(id)
					setClient(response.data.client)
				}
			} catch (error) {
				console.error("Error fetching client:", error)
				navigate("/")
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
		<div>
			<div className="flex flex-col items-center">
				<div className="shadow rounded-xl overflow-hidden w-full max-w-lg">
					<div className="bg-gray-800 flex flex-row p-4 justify-between items-center text-white">
						<div>
							<button
								type="button"
								onClick={() => navigate("/dashboard")}
								className="text-white"
							>
								← חזרה
							</button>
							<span> | </span>
							<span>
								{client.firstName} {client.lastName}
							</span>
						</div>

						<button
							type="button"
							onClick={handleEdit}
							className="p-2 rounded shadow bg-blue-500"
						>
							עריכה
						</button>
					</div>

					<div className="bg-white p-4 flex flex-col gap-4">
						{editMode ? (
							<ClientEdit
								editMode={handleEdit}
								onSubmit={handleSubmit}
								client={client}
							/>
						) : (
							<>
								<div className="flex flex-col">
									<span>גיל: {client.age}</span>
									<span>משקל: {client.weight}</span>
									<span>מטרה: {client.goal}</span>
									<span>הערות: {client.notes}</span>
								</div>

								<div>
									<button
										type="button"
										onClick={() => {
											navigate(`/dashboard/clients/${client._id}/workouts`)
										}}
										className="bg-gray-100 hover:bg-gray-300 p-2 rounded shadow"
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
		</div>
	)
}

export default ClientDetailsPage
