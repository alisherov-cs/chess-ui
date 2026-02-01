import { Button, Icons, Logo } from "@/components";
import { navbarLinks } from "@/constants";
import { useGetProfile } from "@/features/auth/profile/api/profile.request";
import { ToggleTheme } from "@/features/theme";
import { Link } from "react-router-dom";

export const Sidebar = () => {
    const { data: profile, isFetched } = useGetProfile();

    return (
        <div className="h-screen sticky top-0 left-0 py-5 px-3 bg-bg-secondary w-50 flex flex-col justify-between">
            <div>
                <Logo />
                <div className="flex flex-col items-start gap-2 mt-10">
                    {navbarLinks.map((link) => (
                        <Link
                            to={link.href}
                            key={link.href}
                            className="flex items-center gap-4 transition-all duration-150 hover:bg-bg-tertiary w-full px-4 py-2 rounded-md"
                        >
                            {link.icon}
                            <span className="font-semibold">{link.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {isFetched && !profile && (
                    <div className="flex flex-col items-stretch gap-3">
                        <Link to="/auth/signup">
                            <Button className="w-full">Sign Up</Button>
                        </Link>
                        <Link to="/auth/login">
                            <Button className="w-full" variant="secondary">
                                Log In
                            </Button>
                        </Link>
                    </div>
                )}
                {isFetched && profile && (
                    <Link
                        to={`/user/${profile.username}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-150 hover:bg-bg-tertiary"
                    >
                        <div className="w-8 h-8 rounded-md overflow-hidden shrink-0">
                            {profile.avatar ? (
                                <img
                                    width={32}
                                    height={32}
                                    src={profile.avatar}
                                    alt={profile.username}
                                />
                            ) : (
                                <Icons.defaultUser />
                            )}
                        </div>
                        <span className="text-sm truncate line-clamp-1">
                            {profile.username}
                        </span>
                    </Link>
                )}
                <ToggleTheme />
            </div>
        </div>
    );
};
