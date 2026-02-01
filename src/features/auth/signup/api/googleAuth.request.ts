import { axiosPublic } from "@/api";
import { endpoints } from "@/api/endpoints";
import { useMutation } from "@tanstack/react-query";

type TGoogleAuthRequest = {
    access_token: string;
    country: string;
};

type TGoogleAuthResponse = {
    access_token: string;
    initial: boolean;
};

export const useGoogleAuth = () => {
    return useMutation({
        mutationFn: async ({ access_token, country }: TGoogleAuthRequest) => {
            return await axiosPublic.post<TGoogleAuthResponse>(
                endpoints.auth.google,
                {
                    access_token,
                    country,
                }
            );
        },
        onSuccess: ({ data: { access_token } }) => {
            localStorage.setItem("access_token", access_token);
        },
        onError: () => {},
    });
};
