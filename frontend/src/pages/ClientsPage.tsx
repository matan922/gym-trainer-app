import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import ClientCard from "../components/client/ClientCard"
import { getClients } from "../services/api"
import type { Client } from "../types/clientTypes"

function ClientsPage() {
	const [clients, setClients] = useState<Client[]>([])
	// const [error, setError] = useState<string>("")
	const originalClientsList = useRef<Client[]>([])
	const navigate = useNavigate()

	useEffect(() => {
		const getClientsData = async () => {
			try {
				const response = await getClients()
				setClients(response.data)
				originalClientsList.current = response.data
			} catch (error) {
				console.log(error)
			}
		}

		getClientsData()
	}, [])

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		if (!value) return setClients(originalClientsList.current)

		const filteredClients = originalClientsList.current.filter((client) => {
			const clientFullName = `${client.firstName} ${client.lastName}`
			return clientFullName.includes(value)
		})

		setClients(filteredClients)
	}

	return (
		<div className="p-8 w-full flex flex-col items-center">
			<div className="max-w-lg w-full">
				<div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
					<h1 className="text-3xl font-bold text-gray-800 text-center">
						מתאמנים
					</h1>
					<div className="flex flex-row justify-center">
						<input
							onChange={(e) => handleSearchChange(e)}
							className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none max-w-50 "
							placeholder="חיפוש"
							type="text"
						/>
					</div>
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
