import type { Client } from "../../types/clientTypes"

interface ClientEditProps {
	client: Client
	onSubmit: (editData: Client) => void
	editMode: () => void
}

const ClientEdit = ({ client, onSubmit, editMode }: ClientEditProps) => {

	const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		const updatedClient: Client = {
			...client,
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			age: Number(formData.get("age")),
			weight: Number(formData.get("weight")),
			goal: formData.get("goal") as string,
			notes: formData.get("notes") as string,
		}

		onSubmit(updatedClient)
	}

	if (!client) {
		return <div>טוען...</div>
	}

	return (
		<form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
			<div className="flex flex-col sm:flex-row gap-4">
				<input
					defaultValue={client.firstName}
					name="firstName"
					className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
					placeholder="שם"
					type="text"
				/>
				<input
					defaultValue={client.lastName}
					name="lastName"
					className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
					placeholder="משפחה"
					type="text"
				/>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
				<input
					defaultValue={client.age}
					name="age"
					className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
					placeholder="גיל"
					type="number"
				/>
				<input
					defaultValue={client.weight}
					name="weight"
					className="w-full shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
					placeholder="משקל"
					type="number"
				/>
				<input
					defaultValue={client.goal}
					name="goal"
					className="w-full col-span-2 sm:col-span-1 shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
					placeholder="מטרה"
					type="text"
				/>
			</div>

			<textarea
				defaultValue={client.notes}
				name="notes"
				className="p-2 shadow rounded-sm bg-gray-100 focus:bg-gray-300 outline-none"
				placeholder="מידע נוסף"
			></textarea>

			<div className="flex gap-4 justify-center">
				<button
					type="submit"
					className="p-2 shadow rounded-sm bg-blue-500 text-white"
				>
					אישור
				</button>
				<button onClick={editMode} type="button" className="p-2 shadow rounded-sm bg-gray-100">
					ביטול
				</button>
			</div>
		</form>
	)
}

export default ClientEdit
