import dayjs from "dayjs";
import type { Client } from "../../types/clientTypes";

interface ClientCardProps {
	client: Client;
	onCard: () => void;
}

function ClientCard({ client, onCard }: ClientCardProps) {
	return (
		<button
			onClick={onCard}
			key={client._id}
			type="button"
			className="bg-surface rounded-xl shadow-xl border border-trainer-primary/20 p-6 hover:shadow-2xl hover:border-trainer-primary/30 hover:bg-sidebar-item-hover-trainer transition-all text-right"
		>
			<div className="flex flex-col gap-3">
				{/* Client Name */}
				<div className="flex items-center gap-2 pb-3 border-b-2 border-trainer-primary/20">
					<span className="text-2xl">👤</span>
					<h3 className="text-xl font-bold text-trainer-dark">
						{client.firstName} {client.lastName}
					</h3>
				</div>

				{/* Goal */}
				<div className="flex items-center gap-2">
					<span className="text-lg">🎯</span>
					<span className="text-sm text-text-medium font-medium">{client.goal}</span>
				</div>

				{/* Last Session */}
				<div className="flex items-center justify-between p-3 bg-white rounded-lg border-r-4 border-trainer-primary">
					<span className="text-sm text-text-light">אימון אחרון:</span>
					<span className="text-sm font-bold text-trainer-primary">
						{client.lastSessionDate && new Date(client.lastSessionDate).toDateString() === new Date().toDateString()
							? "היום"
							: dayjs(client.lastSessionDate).fromNow()}
					</span>
				</div>
			</div>
		</button>
	);
}

export default ClientCard;
