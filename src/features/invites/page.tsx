import { Icons } from "@/components";
import { useFindAllInvitations } from "./api/findAllInvitations.request";
import { useEffect, useMemo, useState } from "react";
import { Theme, useTheme } from "@/context/theme";
import { clsx } from "clsx";
import { InvitationCard } from "./components/invitationCard";
import { socket } from "@/socket";
import { useReadAllInvitations } from "./api/readAllInvitations.request";
import { AppEvents, eventEmitter } from "@/services/eventEmitter";

export default function InvitesPage() {
    const { data: invitationsData, refetch } = useFindAllInvitations();
    const { mutateAsync: readAll } = useReadAllInvitations();
    const { theme } = useTheme();
    const [deviceTheme] = useState(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
        return "light";
    });

    useEffect(() => {
        readAll().then(() => refetch());
        socket.on("newChellange", () => refetch());
        eventEmitter.on(AppEvents.CHELLANGE_REJECTED, () => refetch());
        eventEmitter.on(AppEvents.CHELLANGE_ACCEPTED, () => refetch());
    }, []);

    const invites = useMemo(
        () => invitationsData?.pages.flatMap((page) => page.data),
        [invitationsData]
    );
    const pagination = useMemo(
        () => invitationsData?.pages?.[0].pagination,
        [invitationsData]
    );

    return (
        <div className="w-full py-5">
            <div className="flex items-center gap-3">
                <Icons.invites width={50} height={50} />
                <h3 className="text-2xl font-bold">Invites</h3>
            </div>
            <div className="w-200 bg-bg-primary px-5 py-10 rounded-md mt-10">
                {!!invites?.length && (
                    <div className={clsx("flex items-center gap-2 mb-4")}>
                        <h2 className="font-semibold">invitations</h2>
                        <span className="py-0.5 px-1.5 rounded-sm bg-bg-secondary text-text-secondary text-sm">
                            {pagination?.total}
                        </span>
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    {invites?.map((invitation) => (
                        <InvitationCard
                            key={invitation.id}
                            invitation={invitation}
                        />
                    ))}
                </div>
                {!invites?.length && (
                    <div className="flex flex-col items-center gap-2 mt-10">
                        {theme === Theme.light && <Icons.pawnLight />}
                        {theme === Theme.dark && <Icons.pawnDark />}
                        {theme === Theme.device &&
                            deviceTheme === Theme.light && <Icons.pawnLight />}
                        {theme === Theme.device &&
                            deviceTheme === Theme.dark && <Icons.pawnDark />}
                        <h2 className="text-text-primary">
                            You don't have any invitations yet!
                        </h2>
                        <p className="text-text-muted">
                            Add friends who are ready to chellange you.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
