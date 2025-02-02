import type { Socket } from "socket.io";

export interface ExtendedSocket extends Socket {
	data: {
		host: boolean;
		roomId: string;
		UUID: string;
	};
}

export interface TypedRequestBody<T> extends Express.Request {
	body: T;
}

export type Participant = {
	id: string;
	name: string;
	submitted: boolean;
	risk?: number;
	effort?: number;
	uncertainty?: number;
	sum?: number;
	roomId: string;
};

export type Room = {
	id: string;
	name: string;
};

export type Participants = Map<string, Participant>;

export type Rooms = Map<string, Room>;

export type EstimatesType = {
	risk: number;
	effort: number;
	uncertainty: number;
	sum: number;
};
