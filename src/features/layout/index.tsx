import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/socket";
import type { TInvitation } from "../invites/api/findAllInvitations.request";
import { InvitationCard } from "../invites/components/invitationCard";

export const Layout = () => {
    const notificationSound = useRef<HTMLAudioElement>(null);
    const [invitation, setInvitation] = useState<TInvitation | null>(null);

    useEffect(() => {
        socket.on("newChellange", (invitation) => {
            setInvitation(invitation);
            notificationSound.current?.play();
        });
        socket.on("chellange.rejected", () => setInvitation(null));
        socket.on("chellange.accepted", () => setInvitation(null));
    }, []);

    return (
        <div className="flex bg-bg-tertiary text-text-primary w-full h-full">
            <Sidebar />
            <main className="flex-1 px-5 py-4 flex justify-center">
                <div className="relative container max-w-300">
                    <Outlet />
                </div>
                {invitation && (
                    <div className="absolute bottom-4 right-4 p-4 bg-bg-secondary rounded-md shadow-2xl w-150">
                        <InvitationCard invitation={invitation} />
                    </div>
                )}
            </main>

            <div className="hidden">
                <audio ref={notificationSound} src="/sounds/notify.mp3" />
            </div>
        </div>
    );
};
