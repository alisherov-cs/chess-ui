import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useRejectInvitation = () => {
    return useMutation({
        mutationFn: async (invitationId: string) => {
            return await axiosPrivate.post(endpoints.invitations.reject, {
                invitationId,
            });
        },
    });
};
