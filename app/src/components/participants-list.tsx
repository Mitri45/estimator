import { PersonIcon } from "@radix-ui/react-icons";
import type { Participant } from "common";

interface ParticipantsListProps {
	participants: Participant[];
	highest: {
		risk: number;
		effort: number;
		uncertainty: number;
		sum: number;
	};
	allSubmitted: boolean;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
	participants,
	highest,
	allSubmitted,
}) => {
	return (
		<div className="mb-8">
			<div className="flex items-center gap-2 mb-4">
				<PersonIcon className="w-6 h-6 text-blue-500" />
				<h2 className="text-2xl font-semibold">Participants</h2>
			</div>
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="py-2">Name</th>
						<th className="py-2">Risk</th>
						<th className="py-2">Effort</th>
						<th className="py-2">Uncertainty</th>
						<th className="py-2">Sum</th>
						<th className="py-2">Status</th>
					</tr>
				</thead>
				<tbody>
					{participants.map((participant) => (
						<tr key={participant.id} className="border-t">
							<td className="py-2 px-4 text-center">{participant.name}</td>
							<td
								className={`py-2 px-4 text-center ${allSubmitted && (participant.risk === highest.risk) ? "highest-value" : ""}`}
							>
								{allSubmitted ? participant.risk : "?"}
							</td>
							<td
								className={`py-2 px-4 text-center ${allSubmitted && (participant.effort === highest.effort) ? "highest-value" : ""}`}
							>
								{allSubmitted ? participant.effort : "?"}
							</td>
							<td
								className={`py-2 text-center px-4 ${allSubmitted && (participant.uncertainty === highest.uncertainty) ? "highest-value" : ""}`}
							>
								{allSubmitted ? participant.uncertainty : "?"}
							</td>
							<td
								className={`py-2 px-4 text-center ${allSubmitted && ((participant.risk || 0) + (participant.effort || 0) + (participant.uncertainty || 0) === highest.sum) ? "highest-value" : ""}`}
							>
								{allSubmitted
									? (participant.risk || 0) +
										(participant.effort || 0) +
										(participant.uncertainty || 0)
									: "?"}
							</td>
							<td className="py-2 px-4 text-center">
								{participant.submitted ? (
									<span className="text-green-600">Done ✓</span>
								) : (
									<span className="text-red-600">Pending</span>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ParticipantsList;
