import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import type { TUser } from "@/features/friends/api/findSuggestions.request";
import type { PlayAs } from "@/features/play/components/playWithFriend";
import { useApiPagination } from "@/hooks/useApiPagination";
import { useInfiniteQuery } from "@tanstack/react-query";

export type TInvitation = {
    id: string;
    duration: number;
    invitedAt: string;
    rated: boolean;
    playAs: PlayAs;
    timeId: string;
    status: string;
    from: TUser;
};

export const useFindAllInvitations = () => {
    const { page, limit, infiniteQueryProps } =
        useApiPagination<TInvitation[]>();

    return useInfiniteQuery({
        queryKey: [endpoints.invitations.all, { page, limit }],
        queryFn: async () => {
            return (
                await axiosPrivate.get(endpoints.invitations.all, {
                    params: {
                        page,
                        limit,
                    },
                })
            ).data;
        },
        ...infiniteQueryProps,
    });
};
