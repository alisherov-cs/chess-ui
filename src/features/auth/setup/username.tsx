import { Button, Input, Loading } from "@/components";
import { ArrowRightIcon, ChevronLeftIcon, UserIcon } from "lucide-react";
import { useGetProfile } from "../profile/api/profile.request";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { axiosPrivate } from "@/api";
import { useState, useEffect } from "react";
import { useSetupUsername } from "./api/setupUsername.request";
import { toast } from "sonner";

export default function AuthSetupUsernamePage() {
    const navigate = useNavigate();
    const { data: profile, isLoading } = useGetProfile();
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const { mutateAsync: setupUsername } = useSetupUsername();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
        reset,
    } = useForm({
        defaultValues: {
            username: profile?.username || "",
        },
    });

    const username = watch("username");

    // Update form when profile loads
    useEffect(() => {
        if (profile?.username) {
            reset({ username: profile.username });
        }
    }, [profile, reset]);

    // Real-time username checking
    useEffect(() => {
        if (
            !username ||
            username.length < 3 ||
            username === profile?.username
        ) {
            setIsAvailable(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsChecking(true);
            try {
                const { data } = await axiosPrivate.post(
                    "/auth/username/check",
                    {
                        username,
                    }
                );

                setIsAvailable(data); // Assuming data is true/false

                if (!data) {
                    setError("username", {
                        type: "manual",
                        message: "Username is already taken",
                    });
                } else {
                    clearErrors("username");
                }
            } catch (err) {
                console.error(err);
                setIsAvailable(null);
            } finally {
                setIsChecking(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username, profile?.username, setError, clearErrors]);

    const submit = async ({ username }: { username: string }) => {
        if (username === profile?.username) {
            if (profile?.googleId) {
                return navigate("/auth/setup/password");
            } else {
                toast.success("Signed up successfully");
                return navigate("/home");
            }
        }

        setupUsername(username).then(() => {
            if (profile?.googleId) {
                navigate("/auth/setup/password");
            } else {
                toast.success("Signed up successfully");
                navigate("/home");
            }
        });
    };

    if (isLoading) return <Loading />;

    return (
        <div className="w-full h-full flex justify-center">
            <div className="flex flex-col justify-center py-20 container max-w-250 h-full">
                <div className="flex items-center justify-between">
                    <Button
                        variant="secondary"
                        className="bg-transparent"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeftIcon size={28} />
                    </Button>
                    <Button
                        variant="secondary"
                        className="flex items-center gap-3"
                        onClick={() =>
                            navigate(
                                profile?.googleId
                                    ? "/auth/setup/password"
                                    : "/home"
                            )
                        }
                    >
                        <span>skip</span>
                        <ArrowRightIcon size={20} />
                    </Button>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <form
                        id="setup-username-form"
                        onSubmit={handleSubmit(submit)}
                    >
                        <Input
                            label="Your Username"
                            icon={<UserIcon color="#b3b3b3" />}
                            placeholder="username"
                            error={errors.username?.message}
                            {...register("username", {
                                required: "Username is required",
                            })}
                        />

                        {/* Availability indicator */}
                        {username &&
                            username.length >= 3 &&
                            username !== profile?.username && (
                                <div className="mt-2 text-sm">
                                    {isChecking && (
                                        <span className="text-gray-500">
                                            ⏳ Checking availability...
                                        </span>
                                    )}
                                    {!isChecking && isAvailable === true && (
                                        <span className="text-green-500">
                                            ✓ Username available
                                        </span>
                                    )}
                                    {!isChecking && isAvailable === false && (
                                        <span className="text-red-500">
                                            ✗ Username taken
                                        </span>
                                    )}
                                </div>
                            )}
                    </form>
                </div>

                <div className="flex items-center justify-end">
                    <Button
                        form="setup-username-form"
                        type="submit"
                        className="px-8"
                        disabled={
                            isSubmitting || isChecking || isAvailable === false
                        }
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
