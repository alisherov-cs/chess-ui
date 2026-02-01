// https://restcountries.com/v3.1/alpha/uz
import { Button, Icons } from "@/components";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../signup/api/googleAuth.request";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const GoogleAuth = () => {
    const navigate = useNavigate();
    const { mutateAsync: googleAuth } = useGoogleAuth();

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            const { data } = await axios.get<{ country_code: string }>(
                "https://ipapi.co/json/"
            );

            googleAuth({
                access_token: codeResponse.access_token,
                country: data.country_code.toLowerCase(),
            }).then(({ data: { initial } }) => {
                if (initial) {
                    navigate("/auth/setup/username");
                } else {
                    navigate("/home");
                }
            });
        },
        onError: (error) => console.log("Login Failed:", error),
    });

    return (
        <Button
            onClick={() => login()}
            variant="secondary"
            className="w-full py-3 text-lg justify-evenly!"
        >
            <Icons.google />
            <span>Continue with Google</span>
        </Button>
    );
};
