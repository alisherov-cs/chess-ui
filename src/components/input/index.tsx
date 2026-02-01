import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
    forwardRef,
    useState,
    type ComponentPropsWithoutRef,
    type ReactNode,
} from "react";

type TInput = ComponentPropsWithoutRef<"input"> & {
    icon?: ReactNode;
    label?: string;
    error?: string;
};

export const Input = forwardRef<HTMLInputElement, TInput>(
    ({ icon, label, type, error, ...rest }, ref) => {
        const [open, setOpen] = useState(false);

        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <div>
                        <span className="text-text-primary">{label}</span>
                    </div>
                )}
                <div className="bg-bg-tertiary border border-text-muted px-3 py-2 rounded-md flex items-center justify-between gap-3">
                    {icon && icon}
                    <input
                        ref={ref}
                        className="flex-1 text-text-secondary"
                        type={
                            type === "password"
                                ? open
                                    ? "text"
                                    : "password"
                                : type
                        }
                        {...rest}
                    />
                    {type === "password" &&
                        (open ? (
                            <EyeIcon
                                size={20}
                                color="#b3b3b3"
                                className="cursor-pointer"
                                onClick={() => setOpen((prev) => !prev)}
                            />
                        ) : (
                            <EyeOffIcon
                                size={20}
                                color="#b3b3b3"
                                className="cursor-pointer"
                                onClick={() => setOpen((prev) => !prev)}
                            />
                        ))}
                </div>
                {error && <span className="text-red-500 text-sm">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";
