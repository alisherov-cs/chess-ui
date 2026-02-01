import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useApiPagination } from "@/hooks/useApiPagination";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Status, TUser } from "./findSuggestions.request";

export type TRequests = {
    id: string;
    status: Status;
    friend: TUser;
};

export const useOutgoingRequests = () => {
    const { page, limit, infiniteQueryProps } = useApiPagination<TRequests[]>();

    return useInfiniteQuery({
        queryKey: [endpoints.friends.outgoingRequests, { page, limit }],
        queryFn: async () => {
            return (
                await axiosPrivate.get(endpoints.friends.outgoingRequests, {
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
