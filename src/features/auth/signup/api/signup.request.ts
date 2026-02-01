import { axiosPublic } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type TSignupRequest = {
    email: string;
    password: string;
};

type TSignupResponse = {
    access_token: string;
};

export const useSignup = () => {
    return useMutation({
        mutationKey: [endpoints.auth.signup],
        mutationFn: async (data: TSignupRequest) => {
            return await axiosPublic.post<TSignupResponse>(
                endpoints.auth.signup,
                data
            );
        },
        onSuccess: ({ data: { access_token } }) => {
            localStorage.setItem("access_token", access_token);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
};
