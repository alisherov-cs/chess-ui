import EventEmitter from "eventemitter3";

export const eventEmitter = new EventEmitter();

export enum AppEvents {
    CANCELED_OUTGOING_REQUEST = "canceled:outgoingRequest",
    CANCELED_INCOMOING_REQUEST = "canceled:incomingRequest",
    ACCEPTED_INCOMOING_REQUEST = "accepted:incomingRequest",
    NEW_OUTGOING_REQUEST = "new:outgoingRequest",
    CHELLANGE_REJECTED = "chellange:rejected",
    CHELLANGE_ACCEPTED = "chellange:accepted",
}
