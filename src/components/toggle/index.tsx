import { clsx } from "clsx";
import type { ReactNode } from "react";

type TToggle = {
    children: ReactNode;
    active: boolean;
    className?: string;
    onToggle: () => void;
};

export const Toggle = ({ children, active, className, onToggle }: TToggle) => {
    return (
        <button
            onClick={onToggle}
            className={clsx(
                "cursor-pointer hover:bg-black/30 text-text rounded-md w-10! h-10! aspect-square flex items-center justify-center",
                active && "bg-black/80 hover:bg-black/80 text-white",
                className
            )}
        >
            {children}
        </button>
    );
};
