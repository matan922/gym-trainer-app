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
		<div className="min-h-screen bg-trainer p-4 lg:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 lg:p-8">
					{/* Header */}
					<div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-trainer-primary/20">
						<span className="text-4xl">💪</span>
						<h1 className="text-3xl lg:text-4xl font-bold text-trainer-dark">
							מתאמנים
						</h1>
						<span className="text-lg text-trainer-primary font-semibold mr-auto">
							({clients.length})
						</span>
					</div>

					{/* Search */}
					<div className="mb-6">
						<div className="relative">
							<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">🔍</span>
							<input
								onChange={(e) => handleSearchChange(e)}
								className="w-full pr-12 pl-4 py-3 border border-trainer-primary/20 rounded-lg bg-white focus:ring-2 focus:ring-trainer-primary focus:border-trainer-primary outline-none transition-all text-right"
								placeholder="חיפוש לפי שם..."
								type="text"
							/>
						</div>
					</div>

					{/* Clients Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
						{clients.length > 0 ? (
							clients.map((client) => (
								<ClientCard
									key={client._id}
									client={client}
									onCard={() => navigate(`/dashboard/client/${client._id}`)}
								/>
							))
						) : (
							<div className="col-span-full text-center py-12">
								<p className="text-text-light text-lg">אין מתאמנים</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ClientsPage
