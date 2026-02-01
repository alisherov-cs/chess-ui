import { Button, Icons } from "@/components";
import type { TUser } from "../../api/findSuggestions.request";
import { useGetCountryData } from "@/features/auth/profile/api/country.request";
import { XIcon } from "lucide-react";
import { useCancelFriendRequest } from "../../api/cancelFriendRequest.request";
import { AppEvents, eventEmitter } from "@/services/eventEmitter";

type TOutgoingCard = {
    user: TUser;
    refetch: () => void;
};

export const OutgoingCard = ({ user, refetch }: TOutgoingCard) => {
    const { id, username, avatar, country: countryCode } = user;
    const { mutateAsync: cancelFriendRequest, isPending } =
        useCancelFriendRequest();
    const { data: country } = useGetCountryData(countryCode);

    const cancelRequest = () => {
        cancelFriendRequest(id).then(() => {
            refetch();
            eventEmitter.emit(AppEvents.CANCELED_OUTGOING_REQUEST);
        });
    };

    return (
        <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-md overflow-hidden">
                    {avatar ? <img src={avatar} /> : <Icons.defaultUser />}
                </div>
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
            </div>
            <div>
                <Button
                    disabled={isPending}
                    onClick={cancelRequest}
                    variant="secondary"
                    className="p-1.5!"
                >
                    <XIcon />
                </Button>
            </div>
        </div>
    );
};
