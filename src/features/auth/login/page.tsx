import { Button, Icons, Input } from "@/components";
import { LockKeyholeIcon, UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuth } from "../google";
import { useForm } from "react-hook-form";
import { useLogin } from "./api/login.request";

type TLogin = {
    usernameOrEmail: string;
    password: string;
};

export default function LoginPage() {
    const navigate = useNavigate();
    const { mutateAsync: login, isPending } = useLogin();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            usernameOrEmail: "",
            password: "",
        },
    });

    const submit = (data: TLogin) => {
        login(data).then(() => navigate("/home"));
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-80 flex flex-col items-center gap-4">
                <h1 className="text-3xl font-semibold text-center">
                    Login To Your Chess.com Account
                </h1>
                <Icons.authentication />
                <form
                    id="login-form"
                    onSubmit={handleSubmit(submit)}
                    className="w-full flex flex-col gap-3"
                >
                    <Input
                        error={errors.usernameOrEmail?.message}
                        icon={<UserIcon color="#b3b3b3" />}
                        placeholder="Username or Email"
                        {...register("usernameOrEmail", {
                            required: "please enter username or email",
                        })}
                    />
                    <Input
                        type="password"
                        error={errors.password?.message}
                        icon={<LockKeyholeIcon color="#b3b3b3" />}
                        placeholder="Password"
                        {...register("password", {
                            required: "password is required",
                        })}
                    />
                </form>
                <Button
                    form="login-form"
                    type="submit"
                    className="w-full text-lg py-3"
                    disabled={isPending}
                >
                    Login
                </Button>
                <fieldset className="border-t border-border w-full text-center">
                    <legend className="px-3 text-text-muted text-sm">OR</legend>
                </fieldset>
                <GoogleAuth />
                <div className="text-sm text-text-secondary flex items-center gap-2">
                    <span>Don't have an account?</span>
                    <Link to="/auth/signup" className="text-blue underline">
                        sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
