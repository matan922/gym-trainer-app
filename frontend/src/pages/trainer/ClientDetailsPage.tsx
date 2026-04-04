import { useNavigate, useParams } from "react-router"
import DeleteClientButton from "../../components/client/DeleteClientButton"
import { getClient } from "../../services/trainerApi"
import { useQuery } from "@tanstack/react-query"
import { CalendarSolidIcon, ClipBoardSolidIcon } from "../../components/icons/Icons"

const ClientDetailsPage = () => {
	const { id } = useParams()
	const navigate = useNavigate()

	const { data: clientData, isPending, isError } = useQuery({
		queryKey: ['client', id],
		queryFn: () => getClient(id!),
		enabled: !!id
	})

	console.log(clientData)
	const client = clientData?.client
	const clientId = clientData?.client._id

	if (isPending) return <div>טוען...</div>
	if (isError) return <div>שגיאה בטעינת הלקוח</div>
	if (!client) return <div>לקוח לא נמצא</div>

	// TODO FUTURE: PUT IT ALL IN COMPONENTS
	return (
		<div className="min-h-screen bg-trainer p-4 lg:p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 lg:p-8">
					{/* Header */}
					<div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-trainer-primary/20">
						<h1 className="text-3xl lg:text-4xl font-bold text-trainer-dark">
							{client.firstName} {client.lastName}
						</h1>
					</div>

					{/* Client Info */}
					<div className="flex flex-col gap-4 mb-6">
						{/* Age Card */}
						<div className="flex items-center gap-3 p-4 bg-white rounded-lg border-r-4 border-trainer-primary">
							<div className="flex flex-col gap-1 flex-1">
								<span className="text-sm text-text-medium font-medium">גיל</span>
								<span className="text-lg font-bold text-trainer-primary">{client.age}</span>
							</div>
						</div>

						{/* Weight Card */}
						<div className="flex items-center gap-3 p-4 bg-white rounded-lg border-r-4 border-trainer-primary">
							<div className="flex flex-col gap-1 flex-1">
								<span className="text-sm text-text-medium font-medium">משקל</span>
								<span className="text-lg font-bold text-trainer-primary">{client.weight} ק"ג</span>
							</div>
						</div>

						{/* Goal Card */}
						<div className="flex items-center gap-3 p-4 bg-white rounded-lg border-r-4 border-trainer-primary">
							<div className="flex flex-col gap-1 flex-1">
								<span className="text-sm text-text-medium font-medium">מטרה</span>
								<span className="text-lg font-bold text-trainer-primary">{client.goal}</span>
							</div>
						</div>

						{/* Notes Card */}
						{client.notes && (
							<div className="flex items-start gap-3 p-4 bg-white rounded-lg border-r-4 border-trainer-primary">
								<div className="flex flex-col gap-1 flex-1">
									<span className="text-sm text-text-medium font-medium">הערות</span>
									<p className="text-base text-text-dark text-right">{client.notes}</p>
								</div>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 pt-4 border-t-2 border-trainer-primary/20">
						<button
							type="button"
							onClick={() => {
								navigate(`/clients/${clientId}/workouts`)
							}}
							className="flex-1 flex items-center justify-center gap-2 bg-trainer-primary hover:bg-trainer-dark text-white py-3 px-4 rounded-lg font-semibold shadow-md transition-all"
						>
							<ClipBoardSolidIcon className="w-6 h-6" />
							תוכניות
						</button>
						<button
							type="button"
							onClick={() => {
								navigate(`/sessions/${clientId}`)
							}}
							className="flex-1 flex items-center justify-center gap-2 bg-trainer-primary hover:bg-trainer-dark text-white py-3 px-4 rounded-lg font-semibold shadow-md transition-all"
						>
							<CalendarSolidIcon className="w-6 h-6" />
							פגישות
						</button>
						<DeleteClientButton
							onDelete={() => navigate("/dashboard")}
							clientId={clientId!}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ClientDetailsPage
