import { Button, Loading } from "@/components";
import { Navigate, useNavigate } from "react-router-dom";
import { useGetProfile } from "../auth/profile/api/profile.request";

export default function WelcomePage() {
    const { data: profile, isLoading, isFetched } = useGetProfile();
    const navigate = useNavigate();

    if (isLoading) return <Loading />;

    if (isFetched && profile) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="py-8 flex items-center justify-between h-full">
            <div>
                <img src="/chessboard.gif" />
            </div>
            <div className="flex flex-col items-center gap-5 text-center">
                <h1 className="text-4xl font-bold">
                    Play Chess Online on the #1 Site!
                </h1>
                <p className="font-semibold text-text-secondary">
                    Join 230+ million players in the world's largest chess
                    community
                </p>
                <Button
                    onClick={() => navigate("/home", { replace: true })}
                    className="w-[80%] py-4 text-lg"
                >
                    Get Started
                </Button>
            </div>
        </div>
    );
}
