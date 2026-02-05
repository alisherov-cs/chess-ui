import { Button, Icons, Loading } from "@/components";
import { useGetCountryData } from "@/features/auth/profile/api/country.request";
import { useFindFriendById } from "@/features/friends/api/findFriendById";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Settings, type TValues } from "../settings";
import { clsx } from "clsx";
import { useSendChellange } from "../../api/sendChellange.request";
import { socket } from "@/socket";

export enum PlayAs {
    white = "white",
    black = "black",
    random = "random",
}

export const PlayWithFriend = () => {
    const [searchParams] = useSearchParams();
    const friendId = useMemo(() => searchParams.get("friend"), [searchParams]);
    const { data: friend, isLoading } = useFindFriendById(friendId);
    const { data: country } = useGetCountryData(friend?.country);
    const { mutateAsync: chellange } = useSendChellange();
    const [playAs, setPlayAs] = useState<PlayAs>(PlayAs.random);
    const [settings, setSettings] = useState<TValues>({
        rated: true,
        duration: 900000,
        timeId: "rapid-15.10",
    });
    const navigate = useNavigate();

    const onSettingsChange = (values: TValues) => {
        setSettings(values);
    };

    const sendChellange = () => {
        if (!friendId) return;

        chellange({ ...settings, playAs, friendId }).then((res) => {
            socket.emit("joinGameRoom", res.data.id);
            navigate(`/game/${res.data.id}`);
        });
    };

    if (isLoading) return <Loading />;

    return (
        <div className="flex flex-col items-center py-2 gap-3">
            <div className="flex items-center gap-2">
                <Icons.handshake className="w-8 h-8" />
                <span>Play vs</span>
            </div>
            <div className="py-2 flex flex-col items-center gap-2">
                {friend?.avatar ? (
                    <img className="w-20 h-20 rounded-md" src={friend.avatar} />
                ) : (
                    <Icons.defaultUser className="w-20 h-20 rounded-md" />
                )}
                <div className="flex items-center gap-1">
                    <h3 className="text-text-primary font-semibold">
                        {friend?.username ?? "Oponent"}
                    </h3>
                    {friend?.elo && (
                        <span className="text-sm text-text-secondary">
                            ({friend.elo})
                        </span>
                    )}
                    {country?.[0] && (
                        <div>
                            <img
                                src={country[0].flags.svg}
                                alt={country[0].flags.alt}
                                className="h-3.5 w-5 rounded-xs cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            </div>
            <Settings onChange={onSettingsChange} />
            <div className="w-full flex items-center justify-between gap-2 py-2">
                <h4>I play as</h4>
                <div className="flex items-center gap-3">
                    <div
                        className={clsx(
                            "border-3 rounded-lg",
                            playAs === PlayAs.white
                                ? "border-success"
                                : "border-transparent"
                        )}
                    >
                        <div
                            onClick={() => setPlayAs(PlayAs.white)}
                            className={clsx(
                                "bg-white w-12 h-12 rounded-md play-as-white flex items-center justify-center cursor-pointer"
                            )}
                        >
                            <span className="text-black text-3xl select-none">
                                &#9812;
                            </span>
                        </div>
                    </div>
                    <div
                        className={clsx(
                            "border-3 rounded-lg",
                            playAs === PlayAs.random
                                ? "border-success"
                                : "border-transparent"
                        )}
                    >
                        <div
                            onClick={() => setPlayAs(PlayAs.random)}
                            className={clsx(
                                "relative w-12 h-12 rounded-md play-as-white flex items-center justify-center cursor-pointer"
                            )}
                        >
                            <Icons.questionMark className="z-999 w-8! h-8! fill-white stroke-black stroke-40 text-3xl" />
                            <div className="absolute top-0 left-0 h-full w-[50%] bg-white rounded-l-md" />
                            <div className="absolute top-0 right-0 h-full w-[50%] bg-black rounded-r-md" />
                        </div>
                    </div>
                    <div
                        className={clsx(
                            "border-3 rounded-lg",
                            playAs === PlayAs.black
                                ? "border-success"
                                : "border-transparent"
                        )}
                    >
                        <div
                            onClick={() => setPlayAs(PlayAs.black)}
                            className={clsx(
                                "bg-black w-12 h-12 rounded-md play-as-white flex items-center justify-center cursor-pointer"
                            )}
                        >
                            <span className="text-white text-3xl select-none">
                                &#9812;
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <Button
                onClick={sendChellange}
                className="py-3 text-lg font-bold w-full"
            >
                Send Challenge
            </Button>
        </div>
    );
};
