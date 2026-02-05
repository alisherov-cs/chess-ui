import { useGetCountryData } from "@/features/auth/profile/api/country.request";
import { Button, Icons } from "@/components";
import type { TInvitation } from "../api/findAllInvitations.request";
import { CheckIcon, XIcon } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useMemo } from "react";
import { durations } from "@/constants";
import { PlayAs } from "@/features/play/components/playWithFriend";
import { clsx } from "clsx";
import { useRejectInvitation } from "../api/rejectInvitation.request";
import { useAcceptInvitation } from "../api/acceptInvitation.request";
import { AppEvents, eventEmitter } from "@/services/eventEmitter";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket";

const playerColors = {
    [PlayAs.white]: (
        <div className={clsx("")}>
            <div
                className={clsx(
                    "bg-white w-8 h-8 rounded-md play-as-white flex items-center justify-center"
                )}
            >
                <span className="text-black text-3xl select-none">&#9812;</span>
            </div>
        </div>
    ),
    [PlayAs.random]: (
        <div className={clsx("")}>
            <div
                className={clsx(
                    "relative w-8 h-8 rounded-md play-as-white flex items-center justify-center"
                )}
            >
                <Icons.questionMark className="z-999 w-8! h-4! fill-white stroke-black stroke-40 text-3xl" />
                <div className="absolute top-0 left-0 h-full w-[50%] bg-white rounded-l-md" />
                <div className="absolute top-0 right-0 h-full w-[50%] bg-black rounded-r-md" />
            </div>
        </div>
    ),
    [PlayAs.black]: (
        <div className={clsx("")}>
            <div
                className={clsx(
                    "bg-black w-8 h-8 rounded-md play-as-white flex items-center justify-center"
                )}
            >
                <span className="text-white text-3xl select-none">&#9812;</span>
            </div>
        </div>
    ),
};

type TInvitationCard = {
    invitation: TInvitation;
};

export const InvitationCard = ({ invitation }: TInvitationCard) => {
    const {
        id,
        from: { username, avatar, email, country: countryCode },
        rated,
        playAs,
        timeId,
        invitedAt,
    } = invitation;
    const { mutateAsync: reject, isPending: rejecting } = useRejectInvitation();
    const { mutateAsync: accept, isPending: accepting } = useAcceptInvitation();
    const { data: country } = useGetCountryData(countryCode);
    const navigate = useNavigate();

    const activeDurationData = useMemo(() => {
        return durations.find((duration) =>
            duration.children.some((child) => child.id === timeId)
        );
    }, [timeId]);

    const activeTimeData = useMemo(() => {
        return activeDurationData?.children.find(
            (child) => child.id === timeId
        );
    }, [activeDurationData, timeId]);

    const onReject = () => {
        reject(id).then(() => eventEmitter.emit(AppEvents.CHELLANGE_REJECTED));
    };

    const onAccept = () => {
        accept(id).then((res) => {
            socket.emit("joinGameRoom", res.data.id);
            eventEmitter.emit(AppEvents.CHELLANGE_ACCEPTED);
            navigate(`/game/${res.data.id}`);
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
            <div className="flex flex-col gap-2 items-center">
                <div className="flex items-center gap-2">
                    {activeDurationData?.icon}
                    <span>
                        {activeTimeData?.title} (
                        {rated ? activeDurationData?.title : "Unrated"})
                    </span>
                    {playerColors[playAs]}
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={onAccept}
                        disabled={rejecting || accepting}
                        className="w-10! h-10! p-0!"
                    >
                        <CheckIcon />
                    </Button>
                    <Button
                        onClick={onReject}
                        variant="secondary"
                        disabled={rejecting || accepting}
                        className="w-10! h-10! p-0!"
                    >
                        <XIcon />
                    </Button>
                </div>
                <p className="text-xs text-text-secondary">
                    {formatDate(invitedAt)}
                </p>
            </div>
        </div>
    );
};
