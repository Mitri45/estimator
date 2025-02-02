import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import type { EstimatesType, Participants, Rooms } from "common";

const port = process.env.SERVER_PORT || 3000;
const origin = process.env.ORIGIN || "http://localhost:5173";
const app = express();
console.log("Server is running on port", process.env.ORIGIN);
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: process.env.NODE_ENV === "production" ? false : [origin],
	},
});
// In-memory storage
const rooms: Rooms = new Map();
const participants: Participants = new Map();

io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("create_room", ({ roomName, userName }) => {
		console.log("create_room", roomName, userName);
		const roomId = Math.random().toString(36).substring(7);
		rooms.set(roomId, { id: roomId, name: roomName });

		const participant = {
			id: socket.id,
			name: userName,
			submitted: false,
			roomId,
		};
		participants.set(socket.id, participant);

		socket.join(roomId);
		socket.emit("room_created", { room: rooms.get(roomId) });
		io.to(roomId).emit(
			"participants_updated",
			Array.from(participants.values()).filter((p) => p.roomId === roomId),
		);
	});

	socket.on("change_room_name", ({ roomId, newRoomName }) => {
		const room = rooms.get(roomId);
		if (room) {
			room.name = newRoomName;
			rooms.set(roomId, room);
			io.to(roomId).emit("room_name_changed", { roomId, newRoomName });
		}
	});

	socket.on("join_room", ({ roomId, userName }) => {
		const room = rooms.get(roomId);
		if (!room) {
			socket.emit("error", "Room not found");
			return;
		}

		const participant = {
			id: socket.id,
			name: userName,
			submitted: false,
			roomId,
		};
		participants.set(socket.id, participant);

		socket.join(roomId);
		socket.emit("room_joined", { room });
		io.to(roomId).emit(
			"participants_updated",
			Array.from(participants.values()).filter((p) => p.roomId === roomId),
		);
	});

	socket.on(
		"submit_estimates",
		({ risk, effort, uncertainty }: EstimatesType) => {
			const participant = participants.get(socket.id);
			if (!participant) return;

			participant.risk = risk;
			participant.effort = effort;
			participant.uncertainty = uncertainty;
			participant.sum = risk + effort + uncertainty;
			participant.submitted = true;
			participants.set(socket.id, participant);

			const roomParticipants = Array.from(participants.values()).filter(
				(p) => p.roomId === participant.roomId,
			);

			io.to(participant.roomId).emit("participants_updated", roomParticipants);
		},
	);

	socket.on("reset_room", ({ roomId }) => {
		const roomParticipants = Array.from(participants.values()).filter(
			(p) => p.roomId === roomId,
		);

		for (const participant of roomParticipants) {
			participant.submitted = false;
			participant.risk = undefined;
			participant.effort = undefined;
			participant.uncertainty = undefined;
			participants.set(participant.id, participant);
		}

		io.to(roomId).emit("participants_updated", roomParticipants);
	});

	socket.on("disconnect", () => {
		const participant = participants.get(socket.id);
		if (participant) {
			participants.delete(socket.id);
			if (participant.roomId) {
				io.to(participant.roomId).emit(
					"participants_updated",
					Array.from(participants.values()).filter(
						(p) => p.roomId === participant.roomId,
					),
				);
			}
		}
	});
});

httpServer.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
