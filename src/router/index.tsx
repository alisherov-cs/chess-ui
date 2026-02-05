import { Loading } from "@/components";
import { AuthGuard } from "@/features/auth/guard";
import { Layout } from "@/features/layout";
import { lazy, Suspense } from "react";
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
const GamePage = lazy(() => import("@/features/game/page"));
const InvitesPage = lazy(() => import("@/features/invites/page"));

export const router = createBrowserRouter([
    {
        element: (
            <Suspense>
                <Layout />
            </Suspense>
        ),
        children: [
            {
                path: "/",
                element: (
                    <Suspense fallback={<Loading />}>
                        <WelcomePage />
                    </Suspense>
                ),
            },
            {
                element: (
                    <Suspense>
                        <AuthGuard />
                    </Suspense>
                ),
                children: [
                    {
                        index: true,
                        path: "/home",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <HomePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/user/:id",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ProfilePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/play",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <PlayPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/friends",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <FriendsPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/game/:id",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <GamePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: "/invites",
                        element: (
                            <Suspense fallback={<Loading />}>
                                <InvitesPage />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
    {
        path: "/auth/signup",
        element: (
            <Suspense fallback={<Loading />}>
                <SignupPage />
            </Suspense>
        ),
    },
    {
        path: "/auth/login",
        element: (
            <Suspense fallback={<Loading />}>
                <LoginPage />
            </Suspense>
        ),
    },
    {
        element: (
            <Suspense fallback={<Loading />}>
                <AuthGuard />
            </Suspense>
        ),
        children: [
            {
                path: "/auth/setup/username",
                element: (
                    <Suspense fallback={<Loading />}>
                        <AuthSetupUsernamePage />
                    </Suspense>
                ),
            },
            {
                path: "/auth/setup/password",
                element: (
                    <Suspense fallback={<Loading />}>
                        <AuthSetupPasswordPage />
                    </Suspense>
                ),
            },
        ],
    },
]);
