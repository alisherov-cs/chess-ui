import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import type { TUser } from "@/features/auth/profile/api/profile.request";
import { useQuery } from "@tanstack/react-query";

export const useFindFriendById = (id?: string | null) => {
    return useQuery({
        enabled: !!id,
        queryKey: [endpoints.friends.byId(id!)],
        queryFn: async () => {
            return (await axiosPrivate.get<TUser>(endpoints.friends.byId(id!)))
                .data;
        },
    });
};
