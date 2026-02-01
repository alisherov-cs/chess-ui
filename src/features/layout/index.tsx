import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar";

export const Layout = () => {
    return (
        <div className="flex bg-bg-tertiary text-text-primary w-full h-full">
            <Sidebar />
            <main className="flex-1 px-5 py-4 flex justify-center">
                <div className="container max-w-300">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
