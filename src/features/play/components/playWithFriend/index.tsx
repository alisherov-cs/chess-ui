import { Button, Icons, Loading } from "@/components";
import { useGetCountryData } from "@/features/auth/profile/api/country.request";
import { useFindFriendById } from "@/features/friends/api/findFriendById";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Settings } from "../settings";

export const PlayWithFriend = () => {
    const [searchParams] = useSearchParams();
    const friendId = useMemo(() => searchParams.get("friend"), [searchParams]);
    const { data: friend, isLoading } = useFindFriendById(friendId);
    const { data: country } = useGetCountryData(friend?.country);

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
            <Settings />
            <div className="w-full flex items-center justify-between gap-2 py-2">
                <h4>I play as</h4>
                <div>
                    <div className="bg-white w-10 h-10 rounded-md play-as-white"></div>
                </div>
            </div>
            <Button className="py-3 text-lg font-bold w-full">
                Send Challenge
            </Button>
        </div>
    );
};
