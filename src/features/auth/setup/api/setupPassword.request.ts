import { axiosPrivate } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

export const useSetupPassword = () => {
    return useMutation({
        mutationFn: async (password: string) => {
            return axiosPrivate.post(endpoints.auth.setupPassword, {
                password,
            });
        },
        onSuccess: () => {},
        onError: () => {},
    });
};
