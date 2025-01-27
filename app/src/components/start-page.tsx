interface StartPageProps {
	userName: string;
	setUserName: (value: string) => void;
	roomName: string;
	setRoomName: (value: string) => void;
	isSharedUrl: boolean;
	joinRoom: (roomId: string, userName: string) => void;
	createRoom: () => void;
}

const StartPage: React.FC<StartPageProps> = ({
	userName,
	setUserName,
	roomName,
	setRoomName,
	isSharedUrl,
	joinRoom,
	createRoom,
}) => {
	return (
		<div className="max-w-md mx-auto pt-20">
			<div className="apple-card">
				<h1 className="text-4xl font-semibold mb-8 text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
					Estimation Room
				</h1>
				<input
					type="text"
					placeholder="Your Name"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					className="w-full p-4 text-lg mb-4"
				/>
				{!isSharedUrl && (
					<input
						type="text"
						placeholder="Room Name"
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}
						className="w-full p-4 text-lg mb-6"
					/>
				)}
				<button
					type="button"
					onClick={
						isSharedUrl
							? () => {
									const roomId = new URLSearchParams(
										window.location.search,
									).get("room");
									if (roomId) joinRoom(roomId, userName);
								}
							: createRoom
					}
					disabled={!userName || (!isSharedUrl && !roomName)}
					className="apple-button w-full text-lg"
				>
					{isSharedUrl ? "Join Room" : "Create Room"}
				</button>
			</div>
		</div>
	);
};

export default StartPage;
