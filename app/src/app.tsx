import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import StartPage from "./components/start-page";
import ParticipantsList from "./components/participants-list";
import Averages from "./components/averages";
import RoomHeader from "./components/room-header";
import type { Participant, Room } from "common";
import {
	socket,
	joinRoom,
	createRoom,
	submitEstimates,
	copyRoomLink,
	resetEstimates,
	calculateAverages,
	getHighestValues,
} from "./lib/utils";
import EstimatesInputs from "./components/estimates-inpits";

export type EstimateInputs = {
	risk: string;
	effort: string;
	uncertainty: string;
};

function App() {
	const [room, setRoom] = useState<Room | null>(null);
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [userName, setUserName] = useState("");
	const [roomName, setRoomName] = useState("");
	const [estimates, setEstimates] = useState<EstimateInputs>({
		risk: "",
		effort: "",
		uncertainty: "",
	});
	const [isSharedUrl, setIsSharedUrl] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const roomId = params.get("room");
		if (roomId) {
			setIsSharedUrl(true);
		}
	}, []);

	useEffect(() => {
		socket.on("room_created", ({ room }) => {
			setRoom(room);
			const shareableUrl = `${window.location.origin}?room=${room.id}`;
			navigator.clipboard.writeText(shareableUrl);
			toast.success("Room created! Shareable URL copied to clipboard");
		});

		socket.on("room_joined", ({ room }) => {
			setRoom(room);
		});

		socket.on("room_name_changed", ({ roomId, newRoomName }) => {
			if (room && room.id === roomId) {
				setRoom({ ...room, name: newRoomName });
			}
		});

		socket.on("participants_updated", (updatedParticipants) => {
			setParticipants(updatedParticipants);
		});

		socket.on("error", (message) => {
			toast.error(message);
		});

		return () => {
			socket.off("room_created");
			socket.off("room_joined");
			socket.off("room_name_changed");
			socket.off("participants_updated");
			socket.off("error");
		};
	}, [room]);

	const allSubmitted = participants.every((p) => p.submitted);
	const averages = calculateAverages(participants);
	const highest = getHighestValues(participants);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
			<Toaster />
			{!room ? (
				<StartPage
					userName={userName}
					setUserName={setUserName}
					roomName={roomName}
					setRoomName={setRoomName}
					isSharedUrl={isSharedUrl}
					joinRoom={joinRoom}
					createRoom={() => createRoom(roomName, userName)}
				/>
			) : (
				<div className="max-w-4xl mx-auto">
					<div className="apple-card">
						<RoomHeader
							room={room}
							isSharedUrl={isSharedUrl}
							allSubmitted={allSubmitted}
							copyRoomLink={copyRoomLink}
							resetEstimates={resetEstimates}
							setEstimates={setEstimates}
						/>

						<ParticipantsList
							participants={participants}
							highest={highest}
							allSubmitted={allSubmitted}
						/>

						{allSubmitted && <Averages averages={averages} />}

						<EstimatesInputs
							estimates={estimates}
							setEstimates={setEstimates}
							submitEstimates={submitEstimates}
							room={room}
							socketId={socket.id}
							participants={participants}
						/>
					</div>
				</div>
			)}
			<p className="absolute bottom-3 right-3  text-center text-gray-500 text-sm mt-4">
				Version {import.meta.env.VITE_VERSION}
			</p>
		</div>
	);
}

export default App;
