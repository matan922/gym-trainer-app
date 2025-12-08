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
		<form className="flex flex-col max-w-64 gap-4" onSubmit={handleEditSubmit}>
			<input
				defaultValue={client.firstName}
				name="firstName"
				className="shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
				placeholder="שם"
				type="text"
			/>
			<input
				defaultValue={client.lastName}
				name="lastName"
				className="shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
				placeholder="משפחה"
				type="text"
			/>
			<input
				defaultValue={client.age}
				name="age"
				className="shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
				placeholder="גיל"
				type="number"
			/>
			<input
				defaultValue={client.weight}
				name="weight"
				className="shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
				placeholder="משקל"
				type="number"
			/>
			<input
				defaultValue={client.goal}
				name="goal"
				className="shadow rounded-sm p-2 bg-gray-100 focus:bg-gray-300 outline-none"
				placeholder="מטרה"
				type="text"
			/>
			<textarea
				defaultValue={client.notes}
				name="notes"
				className="p-2 shadow rounded-sm bg-gray-100 focus:bg-gray-300 outline-none"
				placeholder="מידע נוסף"
			></textarea>

			<button
				type="submit"
				className="p-2 shadow rounded-sm bg-blue-500 text-white"
			>
				אישור
			</button>
			<button onClick={editMode} type="button" className="p-2 shadow rounded-sm bg-gray-100">
				ביטול
			</button>
		</form>
	)
}

export default ClientEdit