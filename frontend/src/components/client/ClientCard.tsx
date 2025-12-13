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
			className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
		>
			<div className="flex flex-col gap-1 items-start">
				<div className="font-semibold">
					{client.firstName} {client.lastName}
				</div>
				<div className="flex justify-between w-full">
					<span className="text-sm text-gray-600">{client.goal}</span>
					<span className="text-sm text-gray-600">אימון אחרון: {client.lastSessionDate && new Date(client.lastSessionDate).toDateString() === new Date().toDateString()
						? "היום"
						: dayjs(client.lastSessionDate).fromNow()}
					</span>
				</div>
			</div>
		</button>
	);
}

export default ClientCard;
