import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useApiPagination } from "@/hooks/useApiPagination";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export enum Status {
    pending = "pending",
    accepted = "accepted",
    rejected = "rejected",
}

export type TFriended = {
    id: string;
    status: Status;
    userId: string;
};

export type TUser = {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    elo: number;
    country: string;
    friended: TFriended[];
};

export const useFindSuggestions = () => {
    const [searchParams] = useSearchParams();
    const { page, limit, infiniteQueryProps } = useApiPagination<TUser[]>();

    const search = useMemo(() => searchParams.get("search"), [searchParams]);

    return useInfiniteQuery({
        enabled: !!search,
        queryKey: [endpoints.friends.suggestions, { page, limit, search }],
        queryFn: async () => {
            return (
                await axiosPrivate.get(endpoints.friends.suggestions, {
                    params: {
                        search,
                    },
                })
            ).data;
        },
        ...infiniteQueryProps,
    });
};
