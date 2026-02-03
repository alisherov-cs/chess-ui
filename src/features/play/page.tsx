import { Button, Icons } from "@/components";
import { DemoBoard } from "./components/demoBoard";
import { Settings } from "./components/settings";
import { useFindFriends } from "../friends/api/findFriends.request";
import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { PlayFriendCard } from "./components/userCard";
import { useSearchParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { PlayWithFriend } from "./components/playWithFriend";

export default function PlayPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const friendId = useMemo(() => searchParams.get("friend"), [searchParams]);
    const { data: friendsData } = useFindFriends();
    const [activeTab, setActiveTab] = useState("online");

    const friends = useMemo(
        () => friendsData?.pages.flatMap((page) => page.data),
        [friendsData]
    );

    useEffect(() => {
        if (friendId) {
            setActiveTab("friends");
        }
    }, [friendId]);

    const tabs = [
        {
            id: "online",
            Icon: Icons.plus,
            title: "New Game",
            content: (
                <div className="flex flex-col gap-2">
                    <Settings />
                    <div className="flex flex-col gap-2">
                        <Button className="py-3 text-lg font-bold">
                            Start Game
                        </Button>
                        <Button
                            className="py-3 text-lg font-bold flex gap-3"
                            variant="secondary"
                        >
                            <Icons.handshake width={24} height={24} />
                            <span>Play a Friend</span>
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            id: "friends",
            Icon: Icons.people,
            title: "Friends",
            content: (
                <div>
                    {friends?.map((friend) => (
                        <PlayFriendCard key={friend.id} friend={friend} />
                    ))}
                </div>
            ),
        },
    ];

    return (
        <div className="h-full flex gap-4 py-2">
            <DemoBoard />
            <div className="w-100 bg-bg-secondary rounded-md overflow-y-scroll no-scrollbar">
                <div className="grid grid-cols-2 py-4 border-b border-border">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            onClick={() => {
                                searchParams.delete("friend");
                                setSearchParams(searchParams);
                                setActiveTab(tab.id);
                            }}
                            className="flex items-center justify-center cursor-pointer"
                        >
                            <div
                                className={clsx(
                                    "flex flex-col gap-2 items-center justify-center",
                                    activeTab === tab.id
                                        ? "text-text-primary"
                                        : "text-text-secondary"
                                )}
                            >
                                {
                                    <tab.Icon
                                        className={clsx(
                                            activeTab === tab.id
                                                ? "fill-text-primary"
                                                : "fill-text-muted"
                                        )}
                                    />
                                }
                                <h2 className="text-inherit">{tab.title}</h2>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-5 py-10 flex flex-col gap-6">
                    {!friendId ? (
                        tabs.find((item) => item.id === activeTab)?.content
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => {
                                    searchParams.delete("friend");
                                    setSearchParams(searchParams);
                                }}
                                className="absolute top-0 left-0 cursor-pointer transition-all duration-150 hover:bg-bg-tertiary w-10 h-10 flex items-center justify-center rounded-md"
                            >
                                <ArrowLeftIcon />
                            </button>
                            <PlayWithFriend />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
