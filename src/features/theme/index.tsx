import { Toggle } from "@/components";
import { Theme, useTheme } from "@/context/theme";
import { MoonIcon, SunIcon, TvMinimalIcon } from "lucide-react";

export const ToggleTheme = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="w-full flex justify-center">
            <div className="flex items-center gap-3 justify-between">
                <Toggle
                    onToggle={() => setTheme(Theme.light)}
                    active={theme === Theme.light}
                >
                    <SunIcon size={20} />
                </Toggle>
                <Toggle
                    onToggle={() => setTheme(Theme.dark)}
                    active={theme === Theme.dark}
                >
                    <MoonIcon size={20} />
                </Toggle>
                <Toggle
                    onToggle={() => setTheme(Theme.device)}
                    active={theme === Theme.device}
                >
                    <TvMinimalIcon size={20} />
                </Toggle>
            </div>
        </div>
    );
};
