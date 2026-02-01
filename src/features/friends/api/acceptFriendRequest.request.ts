import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useAcceptFriendRequest = () => {
    return useMutation({
        mutationFn: async (friendId: string) => {
            return await axiosPrivate.post(
                endpoints.friends.acceptFriendRequest,
                { friendId }
            );
        },
        onSuccess: () => {},
        onError: () => {},
    });
};
