import { Button, Input } from "@/components";
import { ArrowRightIcon, ChevronLeftIcon, LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSetupPassword } from "./api/setupPassword.request";
import { toast } from "sonner";

export default function AuthSetupPasswordPage() {
    const navigate = useNavigate();
    const { mutateAsync: setupPassword, isPending: isSubmitting } =
        useSetupPassword();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            password: "",
        },
    });

    const submit = ({ password }: { password: string }) => {
        setupPassword(password).then(() => {
            toast.success("Signed up successfully");
            navigate("/home");
        });
    };

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
                        onClick={() => navigate("/home")}
                    >
                        <span>skip</span>
                        <ArrowRightIcon size={20} />
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <form
                        onSubmit={handleSubmit(submit)}
                        id="password-setup-form"
                    >
                        <Input
                            type="password"
                            label="Create Password"
                            icon={<LockKeyhole color="#b3b3b3" />}
                            error={errors.password?.message}
                            {...register("password", {
                                required: "password is required",
                            })}
                        />
                    </form>
                </div>
                <div className="flex items-center justify-end">
                    <Button
                        form="password-setup-form"
                        type="submit"
                        className="px-8"
                        disabled={isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
