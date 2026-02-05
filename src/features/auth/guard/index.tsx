import { Navigate, Outlet } from "react-router-dom";
import { useGetProfile } from "../profile/api/profile.request";
import { Loading } from "@/components";
import { useEffect } from "react";
import { socket } from "@/socket";

export const AuthGuard = () => {
    const { data: profile, isLoading, isFetched } = useGetProfile();

    useEffect(() => {
        if (profile?.id) {
            socket.connect();
            socket.emit("joinOwnRoom", profile.id);
        } else {
            socket.disconnect();
        }
    }, [profile]);

    if (isLoading) return <Loading />;

    if (isFetched && !profile) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};
