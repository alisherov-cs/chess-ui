import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendFriendRequest = () => {
    return useMutation({
        mutationFn: async (friendId: string) => {
            return await axiosPrivate.post(
                endpoints.friends.sendFriendRequest,
                { friendId }
            );
        },
        onSuccess: () => {
            toast.success("Friend request sent!");
        },
        onError: () => {
            toast.error("Something went wrong!");
        },
    });
};
