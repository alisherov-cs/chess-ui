import { axiosPublic } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type TLoginRequest = {
    usernameOrEmail: string;
    password: string;
};

type TLoginResponse = {
    access_token: string;
};

export const useLogin = () => {
    return useMutation({
        mutationKey: [endpoints.auth.login],
        mutationFn: async (data: TLoginRequest) => {
            return await axiosPublic.post<TLoginResponse>(
                endpoints.auth.login,
                data
            );
        },
        onSuccess: ({ data: { access_token } }) => {
            localStorage.setItem("access_token", access_token);
            toast.success("Logged in successfully");
        },
        onError: () => {
            toast.error("Wrong login or password");
        },
    });
};
