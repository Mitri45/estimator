import { useState } from "react";
import {
	Share1Icon,
	ResetIcon,
	Pencil1Icon,
	CheckIcon,
} from "@radix-ui/react-icons";
import type { Room } from "common";
import { socket } from "../lib/utils";

interface RoomHeaderProps {
	room: Room;
	isSharedUrl: boolean;
	allSubmitted: boolean;
	copyRoomLink: (room: Room) => void;
	resetEstimates: (
		room: Room,
		setEstimates: (estimates: {
			risk: string;
			effort: string;
			uncertainty: string;
		}) => void,
	) => void;
	setEstimates: (estimates: {
		risk: string;
		effort: string;
		uncertainty: string;
	}) => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({
	room,
	isSharedUrl,
	allSubmitted,
	copyRoomLink,
	resetEstimates,
	setEstimates,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [newRoomName, setNewRoomName] = useState(room.name);

	const handleRoomNameChange = () => {
		socket.emit("change_room_name", { roomId: room.id, newRoomName });
		setIsEditing(false);
	};

	return (
		<div className="flex justify-between items-center mb-8">
			<div className="flex gap-4">
				{isEditing ? (
					<input
						aria-label="Room name"
						type="text"
						value={newRoomName}
						onChange={(e) => setNewRoomName(e.target.value)}
						className="max-w-[300px] text-4xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
					/>
				) : (
					<h1 className="max-w-[300px] text-ellipsis text-4xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
						{room.name}
					</h1>
				)}
				{!isSharedUrl &&
					(isEditing ? (
						<button
							type="button"
							onClick={handleRoomNameChange}
							className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-lg"
						>
							<CheckIcon className="w-5 h-5" />
							Save
						</button>
					) : (
						<button
							type="button"
							onClick={() => setIsEditing(!isEditing)}
							className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-lg"
						>
							<Pencil1Icon className="w-5 h-5" />
							Edit
						</button>
					))}
			</div>
			<div className="flex gap-4">
				<button
					type="button"
					onClick={() => copyRoomLink(room)}
					className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-lg"
				>
					<Share1Icon className="w-5 h-5" />
					Share Room
				</button>
				{allSubmitted && (
					<button
						type="button"
						onClick={() => resetEstimates(room, setEstimates)}
						className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-lg"
					>
						<ResetIcon className="w-5 h-5" />
						Start new round
					</button>
				)}
			</div>
		</div>
	);
};

export default RoomHeader;
