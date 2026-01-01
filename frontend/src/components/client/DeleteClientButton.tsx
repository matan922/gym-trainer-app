import { deleteClient } from "../../services/api"

const DeleteClientButton = ({ clientId, onDelete }: { clientId: string, onDelete:() => void }) => {
	
	const handleClientDeletion = async () => {
		if (!confirm("האם אתה בטוח שברצונך למחוק לקוח זה?")) return

		try {
			await deleteClient(clientId)
			onDelete()
		} catch (error) {
			console.error("Error deleting client:", error)
			alert("שגיאה במחיקת הלקוח")
			console.log("NAVIGATE WHY")
		}
	}

	return (
		<button
			className="bg-gray-100 hover:bg-gray-300 p-2 rounded shadow"
			onClick={handleClientDeletion}
			type="button"
		>
			מחיקה
		</button>
	)
}

export default DeleteClientButton
