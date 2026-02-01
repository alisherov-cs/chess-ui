import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useQuery } from "@tanstack/react-query";

export type TUser = {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    elo: number;
    country: string;
    googleId?: string;
};

export const useGetProfile = () => {
    return useQuery({
        queryKey: [endpoints.auth.profile],
        queryFn: async () => {
            return (await axiosPrivate.get<TUser>(endpoints.auth.profile)).data;
        },
        retry: false,
    });
};
