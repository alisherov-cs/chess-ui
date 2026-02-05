import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useReadAllIncomingRequests = () => {
    return useMutation({
        mutationFn: async () => {
            return await axiosPrivate.post(endpoints.friends.readAll, {});
        },
    });
};
