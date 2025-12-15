export { auth as middleware } from "@/lib/auth";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/habits/:path*",
        "/feed/:path*",
        "/users/:path*",
        "/leaderboard/:path*",
    ],
};
