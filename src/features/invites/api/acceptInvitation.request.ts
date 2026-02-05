import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useAcceptInvitation = () => {
    return useMutation({
        mutationFn: async (invitationId: string) => {
            return await axiosPrivate.post(endpoints.invitations.accept, {
                invitationId,
            });
        },
    });
};
