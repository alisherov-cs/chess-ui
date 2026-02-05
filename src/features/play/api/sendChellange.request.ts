import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";
import type { PlayAs } from "../components/playWithFriend";
import type { TUser } from "@/features/auth/profile/api/profile.request";

type TSendChellangeRequest = {
    friendId: string;
    duration: number;
    playAs: PlayAs;
    rated: boolean;
    timeId: string;
};

export enum GameStatus {
    pending = "pending",
    ongoing = "ongoing",
    completed = "completed",
    aborted = "aborted",
}

export type TGame = {
    currentPosition: string[];
    drawOffer: string | null;
    duration: number;
    history: string[];
    id: string;
    playerBlackId: string;
    playerWhiteId: string;
    playerWhite: TUser;
    playerBlack: TUser;
    rated: boolean;
    startedAt: string;
    status: GameStatus;
    timeId: string;
    winnerId: string | null;
    winner: TUser | null;
};

export const useSendChellange = () => {
    return useMutation({
        mutationFn: async (data: TSendChellangeRequest) => {
            return await axiosPrivate.post<TGame>(
                endpoints.invitations.sendChellange,
                data
            );
        },
        onSuccess: () => {},
        onError: () => {},
    });
};
