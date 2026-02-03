import { Icons } from "@/components";
import { useGetCountryData } from "../auth/profile/api/country.request";
import { Color } from "@/constants";
import { clsx } from "clsx";
import type { TUser } from "../auth/profile/api/profile.request";

type TUserIndicator = {
    color: Color;
    user?: TUser;
    time: string;
};

export const UserIndicator = ({ color, user, time }: TUserIndicator) => {
    const { data: country } = useGetCountryData(user?.country);

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-2 items-start">
                <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0">
                    {user?.avatar ? (
                        <img
                            width={40}
                            height={40}
                            src={user.avatar}
                            alt={user.username}
                        />
                    ) : color === Color.white ? (
                        <Icons.defaultUser />
                    ) : (
                        <img src="/oponent-black.png" />
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <h3 className="text-text-primary font-semibold">
                        {user?.username ?? "Oponent"}
                    </h3>
                    {user?.elo && (
                        <span className="text-sm text-text-secondary">
                            ({user.elo})
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

            <div
                className={clsx(
                    "h-full w-30 flex items-center justify-end px-5 rounded-sm",
                    color === Color.white ? "bg-text-muted" : "bg-bg-secondary"
                )}
            >
                <h2
                    className={clsx(
                        "text-xl font-semibold",
                        color === Color.white && "text-bg-tertiary"
                    )}
                >
                    {time}
                </h2>
            </div>
        </div>
    );
};
