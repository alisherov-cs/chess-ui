import { Button, Checkbox, Icons } from "@/components";
import { DemoBoard } from "./components/demoBoard";
import { ChevronDownIcon } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { durations } from "@/constants";

export default function PlayPage() {
    const [open, setOpen] = useState(false);
    const [rated, setRated] = useState(true);
    const [activeDuration, setActiveDuration] = useState("rapid-15.10");

    const activeDurationData = useMemo(() => {
        return durations.find((duration) =>
            duration.children.some((child) => child.id === activeDuration)
        );
    }, [activeDuration]);

    const activeTimeData = useMemo(() => {
        return activeDurationData?.children.find(
            (child) => child.id === activeDuration
        );
    }, [activeDurationData, activeDuration]);

    return (
        <div className="h-full flex gap-4 py-2">
            <DemoBoard />
            <div className="w-100 bg-bg-secondary rounded-md px-5 py-10 flex flex-col gap-6">
                <div className="w-full flex flex-col gap-3">
                    <Button
                        onClick={() => setOpen((prev) => !prev)}
                        className="py-3 text-lg font-bold flex gap-3 relative"
                        variant="secondary"
                    >
                        {activeDurationData?.icon}
                        <span>
                            {activeTimeData?.title} (
                            {rated ? activeDurationData?.title : "Unrated"})
                        </span>
                        <ChevronDownIcon
                            className={clsx(
                                "absolute right-3",
                                open ? "rotate-180" : "rotate-0"
                            )}
                            color="grey"
                        />
                    </Button>
                    <div className={clsx("pb-4", open ? "visible" : "hidden")}>
                        <div className="flex items-center justify-between py-4">
                            <h4>Rated</h4>
                            <Checkbox
                                checked={rated}
                                onCheck={(rated) => setRated(rated)}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            {durations.map((duration) => (
                                <div
                                    key={duration.id}
                                    className="flex flex-col gap-1"
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{duration.icon}</span>
                                        <span>{duration.title}</span>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        {duration.children.map((child) => (
                                            <div
                                                className={clsx(
                                                    "border-2 rounded-lg p-0.5",
                                                    activeDuration === child.id
                                                        ? "border-success"
                                                        : "border-transparent"
                                                )}
                                            >
                                                <Button
                                                    onClick={() =>
                                                        setActiveDuration(
                                                            child.id
                                                        )
                                                    }
                                                    variant="secondary"
                                                    className="w-full"
                                                >
                                                    {child.title}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button className="py-3 text-lg font-bold">
                        Start Game
                    </Button>
                </div>
                <Button
                    className="py-3 text-lg font-bold flex gap-3"
                    variant="secondary"
                >
                    <Icons.handshake width={24} height={24} />
                    <span>Play a Friend</span>
                </Button>
            </div>
        </div>
    );
}
