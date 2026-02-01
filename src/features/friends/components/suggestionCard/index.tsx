import { Icons } from "@/components";
import { Status, type TUser } from "../../api/findSuggestions.request";
import { useGetCountryData } from "@/features/auth/profile/api/country.request";
import { useSendFriendRequest } from "../../api/sendFriendRequest";
import { AppEvents, eventEmitter } from "@/services/eventEmitter";

type TSuggestionCard = {
    suggestion: TUser;
    refetch: () => void;
};

export const SuggestionCard = ({ suggestion, refetch }: TSuggestionCard) => {
    const { mutateAsync: sendFriendRequest, isPending } =
        useSendFriendRequest();
    const {
        id,
        username,
        friended,
        email,
        avatar,
        country: countryCode,
    } = suggestion;
    const { data: country } = useGetCountryData(countryCode);

    const sendRequest = () => {
        sendFriendRequest(id).then(() => {
            refetch();
            eventEmitter.emit(AppEvents.NEW_OUTGOING_REQUEST);
        });
    };

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
                <Icons.chellange className="fill-text-primary cursor-pointer" />
                {friended?.[0]?.status !== Status.pending ? (
                    <Icons.addToFriend
                        onClick={() => !isPending && sendRequest()}
                        className="fill-text-primary cursor-pointer"
                    />
                ) : (
                    <Icons.menu className="fill-text-primary cursor-pointer" />
                )}
            </div>
        </div>
    );
};
