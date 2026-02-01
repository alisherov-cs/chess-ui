import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useSetupUsername = () => {
    return useMutation({
        mutationFn: async (username: string) => {
            return axiosPrivate.post(endpoints.auth.setupUsername, {
                username,
            });
        },
        onSuccess: () => {},
        onError: () => {},
    });
};
