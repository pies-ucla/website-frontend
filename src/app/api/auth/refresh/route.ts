// app/api/auth/refresh/route.ts
import { cookies } from "next/headers";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
        return new Response(JSON.stringify({ error: "No refresh token" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const response = await fetch(`${API_URL}/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refresh_token=${refreshToken}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.access_token) {
            cookieStore.set({
                name: 'access_token',
                value: data.access_token,
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24
            });
        }

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return new Response(
            JSON.stringify({ error: "Token refresh failed", details: message }),
            { status: 500 }
        );
    }
}
