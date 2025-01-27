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

function App() {
	const [room, setRoom] = useState<Room | null>(null);
	const [participants, setParticipants] = useState<Participant[]>([]);
	const [userName, setUserName] = useState("");
	const [roomName, setRoomName] = useState("");
	const [estimates, setEstimates] = useState({
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

						{!participants.find((p) => p.id === socket.id)?.submitted && (
							<div className="border-t border-gray-100 pt-6">
								<h2 className="text-2xl font-semibold mb-4">Your Estimates</h2>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									<input
										type="number"
										placeholder="Risk (1-10)"
										value={estimates.risk}
										onChange={(e) =>
											setEstimates((prev) => ({
												...prev,
												risk: e.target.value,
											}))
										}
										className="p-4 text-lg"
										min="1"
										max="10"
									/>
									<input
										type="number"
										placeholder="Effort (1-10)"
										value={estimates.effort}
										onChange={(e) =>
											setEstimates((prev) => ({
												...prev,
												effort: e.target.value,
											}))
										}
										className="p-4 text-lg"
										min="1"
										max="10"
									/>
									<input
										type="number"
										placeholder="Uncertainty (1-10)"
										value={estimates.uncertainty}
										onChange={(e) =>
											setEstimates((prev) => ({
												...prev,
												uncertainty: e.target.value,
											}))
										}
										className="p-4 text-lg"
										min="1"
										max="10"
									/>
								</div>
								<button
									type="button"
									onClick={() => submitEstimates(room, estimates)}
									disabled={
										!estimates.risk ||
										!estimates.effort ||
										!estimates.uncertainty
									}
									className="apple-button text-lg"
								>
									Submit Estimates
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
