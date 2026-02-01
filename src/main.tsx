import "@/styles/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./context/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="836777732578-v17sil11vnvfhlbkeaaj456u0i4gtck0.apps.googleusercontent.com">
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <Toaster position="top-center" />
                    <RouterProvider router={router} />
                </ThemeProvider>
            </QueryClientProvider>
        </GoogleOAuthProvider>
    </StrictMode>
);
