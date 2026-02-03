import { AuthGuard } from "@/features/auth/guard";
import { Layout } from "@/features/layout";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const HomePage = lazy(() => import("@/features/home/page"));
const WelcomePage = lazy(() => import("@/features/welcome/page"));
const SignupPage = lazy(() => import("@/features/auth/signup/page"));
const LoginPage = lazy(() => import("@/features/auth/login/page"));
const ProfilePage = lazy(() => import("@/features/auth/profile/page"));
const AuthSetupUsernamePage = lazy(
    () => import("@/features/auth/setup/username")
);
const AuthSetupPasswordPage = lazy(
    () => import("@/features/auth/setup/password")
);
const PlayPage = lazy(() => import("@/features/play/page"));
const FriendsPage = lazy(() => import("@/features/friends/page"));
const GamePage = lazy(() => import("@/features/test/page"));
const GameV2Page = lazy(() => import("@/features/game/page"));

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <WelcomePage /> },
            {
                element: <AuthGuard />,
                children: [
                    { index: true, path: "/home", element: <HomePage /> },
                    { path: "/user/:id", element: <ProfilePage /> },
                    { path: "/play", element: <PlayPage /> },
                    { path: "/friends", element: <FriendsPage /> },
                    { path: "/game", element: <GamePage /> },
                    { path: "/gamev2", element: <GameV2Page /> },
                ],
            },
        ],
    },
    {
        path: "/auth/signup",
        element: <SignupPage />,
    },
    {
        path: "/auth/login",
        element: <LoginPage />,
    },
    {
        element: <AuthGuard />,
        children: [
            {
                path: "/auth/setup/username",
                element: <AuthSetupUsernamePage />,
            },
            {
                path: "/auth/setup/password",
                element: <AuthSetupPasswordPage />,
            },
        ],
    },
]);
