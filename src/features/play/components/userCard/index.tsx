import { Icons } from "@/components";
import { useGetCountryData } from "@/features/auth/profile/api/country.request";
import type { TUser } from "@/features/auth/profile/api/profile.request";
import { useSearchParams } from "react-router-dom";

type TFriendCard = {
    friend: TUser;
};

export const PlayFriendCard = ({ friend }: TFriendCard) => {
    const { id, username, email, avatar, country: countryCode } = friend;
    const { data: country } = useGetCountryData(countryCode);
    const [searchParams, setSearchParams] = useSearchParams();

    const onClick = () => {
        searchParams.set("friend", id);
        setSearchParams(searchParams);
    };

    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between gap-2 cursor-pointer"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md overflow-hidden">
                    {avatar ? <img src={avatar} /> : <Icons.defaultUser />}
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <h2>{username}</h2>
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
                    <p className="text-xs text-text-secondary">{email}</p>
                </div>
            </div>
        </div>
    );
};
