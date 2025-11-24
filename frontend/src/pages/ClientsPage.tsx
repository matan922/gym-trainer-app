import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { fetchClients } from "../services/api"
import type { Client } from "../types/clientTypes"
import ClientCard from "../components/client/ClientCard"

function ClientsPage() {
	const [clients, setClients] = useState<Client[]>([])
	const navigate = useNavigate()
	const [error, setError] = useState<string>("")

	useEffect(() => {
		const getClientsData = async () => {
			try {
				const response = await fetchClients()
				setClients(response.data)
			} catch (error) {
				console.log(error)
				navigate("/")
			}
		}

		getClientsData()
	}, [])

	return (
		<div className="p-8">
			<div className="max-w-lg mx-auto">
				<div className="bg-white rounded-2xl shadow-xl p-8">
					<h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
						מתאמנים
					</h1>
					<div className="flex flex-col gap-4">
						{clients &&
							clients.map((client) => (
								<ClientCard
									key={client._id}
									client={client}
									onCard={() => navigate(`/dashboard/client/${client._id}`)}
								/>
							))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ClientsPage
