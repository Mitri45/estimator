import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import type { AverageTypes as AveragesType, Participant, Room } from "common";

export const socket = io(import.meta.env.VITE_SERVER, {
	transports: ["websocket"],
});

export const joinRoom = (roomId: string, userName: string) => {
	if (!userName) return;
	socket.emit("join_room", { roomId, userName });
};

export const createRoom = (roomName: string, userName: string) => {
	console.log("createRoom", roomName, userName);

	if (!roomName || !userName) return;
	socket.emit("create_room", { roomName, userName });
};

export const submitEstimates = (
	room: Room | null,
	estimates: { risk: string; effort: string; uncertainty: string },
) => {
	if (!room) return;
	socket.emit("submit_estimates", {
		risk: Number.parseInt(estimates.risk),
		effort: Number.parseInt(estimates.effort),
		uncertainty: Number.parseInt(estimates.uncertainty),
	});
	toast.success("Estimates submitted!");
};

export const copyRoomLink = (room: Room | null) => {
	if (!room) return;
	const link = `${window.location.origin}?room=${room.id}`;
	navigator.clipboard.writeText(link);
	toast.success("Room link copied to clipboard!");
};

export const resetEstimates = (
	room: Room | null,
	setEstimates: (estimates: {
		risk: string;
		effort: string;
		uncertainty: string;
	}) => void,
) => {
	if (!room) return;
	socket.emit("reset_room", { roomId: room.id });
	setEstimates({ risk: "", effort: "", uncertainty: "" });
	toast.success("Room has been reset!");
};

export const calculateAverages = (
	participants: Participant[],
): AveragesType => {
	const submittedParticipants = participants.filter((p) => p.submitted);
	if (submittedParticipants.length === 0)
		return { risk: 0, effort: 0, uncertainty: 0, sum: 0 };
	console.log("submittedParticipants", submittedParticipants);
	return {
		risk:
			Math.round(
				(submittedParticipants.reduce((acc, p) => acc + (p.risk || 0), 0) /
					submittedParticipants.length) *
					10,
			) / 10,
		effort:
			Math.round(
				(submittedParticipants.reduce((acc, p) => acc + (p.effort || 0), 0) /
					submittedParticipants.length) *
					10,
			) / 10,
		uncertainty:
			Math.round(
				(submittedParticipants.reduce(
					(acc, p) => acc + (p.uncertainty || 0),
					0,
				) /
					submittedParticipants.length) *
					10,
			) / 10,
		sum:
			Math.round(
				(submittedParticipants.reduce((acc, p) => acc + (p.sum || 0), 0) /
					submittedParticipants.length) *
					10,
			) / 10,
	};
};

export const getHighestValues = (participants: Participant[]) => {
	const submitted = participants.filter((p) => p.submitted);
	if (submitted.length === 0)
		return { risk: 0, effort: 0, uncertainty: 0, sum: 0 };
	return {
		risk: Math.max(...submitted.map((p) => p.risk || 0)),
		effort: Math.max(...submitted.map((p) => p.effort || 0)),
		uncertainty: Math.max(...submitted.map((p) => p.uncertainty || 0)),
		sum: Math.max(
			...submitted.map(
				(p) => (p.risk || 0) + (p.effort || 0) + (p.uncertainty || 0),
			),
		),
	};
};
