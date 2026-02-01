import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { clsx } from "clsx";

type TButton = ComponentPropsWithoutRef<"button"> & {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
};

export const Button = ({
    children,
    className,
    variant = "primary",
    ...rest
}: TButton) => {
    return (
        <button
            className={clsx(
                "select-none text-white font-semibold cursor-pointer flex items-center transition-all duration-150 justify-center py-2 px-4 rounded-md",
                variant === "primary" && "bg-success hover:bg-success/90",
                variant === "secondary" &&
                    "bg-bg-button-secondary hover:bg-bg-button-secondary/90",
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
};
