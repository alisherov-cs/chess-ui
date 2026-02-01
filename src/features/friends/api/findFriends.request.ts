import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useApiPagination } from "@/hooks/useApiPagination";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type TFriend = {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    elo: number;
    country: string;
};

export const useFindFriends = () => {
    const [searchParams] = useSearchParams();
    const { page, limit, infiniteQueryProps } = useApiPagination<TFriend[]>();

    const search = useMemo(() => searchParams.get("search"), [searchParams]);

    return useInfiniteQuery({
        queryKey: [endpoints.friends.all, { page, limit, search }],
        queryFn: async () => {
            return (
                await axiosPrivate.get(endpoints.friends.all, {
                    params: {
                        page,
                        limit,
                        search,
                    },
                })
            ).data;
        },
        ...infiniteQueryProps,
    });
};
