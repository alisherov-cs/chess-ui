import { Navigate, Outlet } from "react-router-dom";
import { useGetProfile } from "../profile/api/profile.request";
import { Loading } from "@/components";

export const AuthGuard = () => {
    const { data: profile, isLoading, isFetched } = useGetProfile();

    if (isLoading) return <Loading />;

    if (isFetched && !profile) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
};
