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
			className="group shadow rounded-lg p-4 flex flex-row justify-between items-center bg-white hover:bg-blue-500 has-[button:hover]:bg-white"
		>
			<div className="flex flex-col gap-1">
				<div className="font-semibold">
					{client.firstName} {client.lastName}
				</div>
				<div className="text-sm text-gray-600">גיל: {client.age}</div>
			</div>
		</button>
	);
}

export default ClientCard;
