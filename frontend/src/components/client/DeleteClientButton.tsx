import { deleteClient } from "../../services/trainerApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const DeleteClientButton = ({ clientId, onDelete }: { clientId: string, onDelete:() => void }) => {
	const queryClient = useQueryClient()

	const deleteMutation = useMutation({
		mutationFn: () => deleteClient(clientId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['clients'] })
			queryClient.invalidateQueries({ queryKey: ['client'] })
			onDelete()
		},
		onError: (error) => {
			console.error("Error deleting client:", error)
			alert("שגיאה במחיקת הלקוח")
		}
	})

	const handleClientDeletion = () => {
		if (!confirm("האם אתה בטוח שברצונך למחוק לקוח זה?")) return
		deleteMutation.mutate()
	}

	return (
		<button
			className="bg-gray-100 hover:bg-gray-300 p-2 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
			onClick={handleClientDeletion}
			disabled={deleteMutation.isPending}
			type="button"
		>
			{deleteMutation.isPending ? "מוחק..." : "מחיקה"}
		</button>
	)
}

export default DeleteClientButton
