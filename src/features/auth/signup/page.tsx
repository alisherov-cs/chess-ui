import { Button, Icons, Input } from "@/components";
import { LockKeyholeIcon, MailIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuth } from "../google";
import { useForm } from "react-hook-form";
import { useSignup } from "./api/signup.request";
import { useEffect, useState } from "react";
import { axiosPublic } from "@/api";

type TSignup = {
    email: string;
    password: string;
};

export default function SignupPage() {
    const navigate = useNavigate();
    const { mutateAsync: signup, isPending } = useSignup();
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        watch,
        setError,
        clearErrors,
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            confirm: "",
        },
    });

    const email = watch("email");

    // Real-time username checking
    useEffect(() => {
        if (!email || email.length < 3) {
            setIsAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsChecking(true);
            try {
                const { data } = await axiosPublic.post("/auth/email/check", {
                    email,
                });

                setIsAvailable(data); // Assuming data is true/false

                if (!data) {
                    setError("email", {
                        type: "manual",
                        message: "Email is already taken",
                    });
                } else {
                    clearErrors("email");
                }
            } catch (err) {
                console.error(err);
                setIsAvailable(null);
            } finally {
                setIsChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [email, setError, clearErrors]);

    const submit = (data: TSignup) => {
        signup(data).then(() => navigate("/auth/setup/username"));
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-80 flex flex-col items-center gap-4">
                <h1 className="text-3xl font-semibold text-center">
                    Create Your Chess.com Account
                </h1>
                <Icons.authentication />
                <form
                    id="signup-form"
                    onSubmit={handleSubmit(submit)}
                    className="w-full flex flex-col gap-3"
                >
                    <Input
                        error={errors.email?.message}
                        icon={<MailIcon color="#b3b3b3" />}
                        placeholder="Email"
                        {...register("email", {
                            required: "email is required",
                        })}
                    />
                    {/* Availability indicator */}
                    {email && email.length >= 3 && (
                        <div className="mt-2 text-sm">
                            {isChecking && (
                                <span className="text-gray-500">
                                    ⏳ Checking availability...
                                </span>
                            )}
                            {!isChecking && isAvailable === true && (
                                <span className="text-green-500">
                                    ✓ Email available
                                </span>
                            )}
                            {!isChecking && isAvailable === false && (
                                <span className="text-red-500">
                                    ✗ Eamil taken
                                </span>
                            )}
                        </div>
                    )}
                    <Input
                        error={errors.password?.message}
                        type="password"
                        icon={<LockKeyholeIcon color="#b3b3b3" />}
                        placeholder="Password"
                        {...register("password", {
                            required: "password is required",
                        })}
                    />
                    <Input
                        error={errors.confirm?.message}
                        type="password"
                        icon={<LockKeyholeIcon color="#b3b3b3" />}
                        placeholder="Confirm Password"
                        {...register("confirm", {
                            required: "please confirm password",
                            validate: (value) => {
                                return (
                                    value === getValues("password") ||
                                    "Passwords do not match"
                                );
                            },
                        })}
                    />
                </form>
                <Button
                    form="signup-form"
                    type="submit"
                    className="w-full text-lg py-3"
                    disabled={isPending || isChecking || isAvailable === false}
                >
                    Sign Up
                </Button>
                <fieldset className="border-t border-border w-full text-center">
                    <legend className="px-3 text-text-muted text-sm">OR</legend>
                </fieldset>
                <GoogleAuth />
                <div className="text-sm text-text-secondary flex items-center gap-2">
                    <span>Already have an account?</span>
                    <Link to="/auth/login" className="text-blue underline">
                        login
                    </Link>
                </div>
            </div>
        </div>
    );
}
