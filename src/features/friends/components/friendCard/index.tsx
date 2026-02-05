import { Button, Icons } from "@/components";
import { type TUser } from "../../api/findSuggestions.request";
import { useGetCountryData } from "@/features/auth/profile/api/country.request";
import { Link } from "react-router-dom";

type TFriendCard = {
    friend: TUser;
};

export const FriendCard = ({ friend }: TFriendCard) => {
    const { id, username, email, avatar, country: countryCode } = friend;
    const { data: country } = useGetCountryData(countryCode);

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-md overflow-hidden">
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
            <div className="flex items-center gap-3">
                <Link to={`/play?friend=${id}`}>
                    <Button className="flex items-center gap-2">
                        <Icons.chellange className="fill-text-primary cursor-pointer" />
                        <span>Chellange</span>
                    </Button>
                </Link>
                <Icons.menu className="fill-text-primary cursor-pointer" />
            </div>
        </div>
    );
};
