import type React from "react"
import { useState } from "react"
import { postClient } from "../services/api"
import type { Client } from "../types/clientTypes"
import { useNavigate } from "react-router"

function AddClientPage() {
	const [clientData, setClientData] = useState<Client>({
		firstName: "",
		lastName: "",
		age: 0,
		weight: 0,
		goal: "",
		notes: "",
		workouts: []
	})
	const navigate = useNavigate()
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			const response = await postClient(clientData)
			navigate('/dashboard')
			return response.data
		} catch (error) {
			console.error("Error creating client:", error)
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
		<div className="flex flex-col gap-8 items-center">
			<h1 className="text-2xl">מתאמן חדש</h1>

			<div className="w-full max-w-lg shadow rounded-lg p-8 bg-white">
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<input
							onChange={handleInputChange}
							name="firstName"
							placeholder="שם"
							className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
							type="text"
						/>
						<input
							onChange={handleInputChange}
							name="lastName"
							placeholder="משפחה"
							className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
							type="text"
						/>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
						<input
							onChange={handleInputChange}
							name="age"
							placeholder="גיל"
							className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
							type="number"
						/>
						<input
							onChange={handleInputChange}
							name="weight"
							placeholder="משקל"
							className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
							type="number"
						/>
						<input
							onChange={handleInputChange}
							name="goal"
							placeholder="מטרה"
							className="w-full col-span-2 sm:col-span-1 shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
							type="text"
						/>
					</div>

					<textarea
						onChange={handleInputChange}
						name="notes"
						className="p-2 shadow rounded-sm bg-gray-100 focus:bg-gray-300 outline-none"
						placeholder="מידע נוסף"
					></textarea>

					<div className="flex gap-4 justify-center">
						<button
							type="submit"
							className="p-2 shadow rounded-sm bg-blue-500 text-white"
						>
							יצירה
						</button>
						<button type="button" className="p-2 shadow rounded-sm bg-gray-100">
							ביטול
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AddClientPage
