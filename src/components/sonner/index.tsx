import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
    CircleCheckIcon,
    InfoIcon,
    TriangleAlertIcon,
    OctagonXIcon,
    Loader2Icon,
} from "lucide-react";
import { useTheme } from "@/context/theme";

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-bg-secondary group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-text-secondary",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:hover:bg-primary-dark",
                    cancelButton:
                        "group-[.toast]:bg-bg-tertiary group-[.toast]:text-text-primary group-[.toast]:hover:bg-hover",
                    closeButton:
                        "group-[.toast]:bg-bg-tertiary group-[.toast]:text-text-muted group-[.toast]:border-border group-[.toast]:hover:bg-hover",
                    success: "group-[.toast]:text-success!",
                    error: "group-[.toast]:text-red!",
                    warning: "group-[.toast]:text-orange!",
                    info: "group-[.toast]:text-blue!",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
