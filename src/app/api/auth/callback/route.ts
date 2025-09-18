// app/api/auth/callback/route.ts
import { cookies } from "next/headers";
const API_URL =  process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
    const cookieStore = await cookies();
    try {
        const { code, redirect_uri } = await request.json();
        const response = await fetch(`${API_URL}/token/get/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code, redirect_uri }),
        });

        const data = await response.json();
        cookieStore.set({
            name: 'access_token',
            value: data.access,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24
        });

        return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
            "Content-Type": "application/json",
        },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return new Response(
        JSON.stringify({
            error: "Token exchange failed",
            details: message || "Unknown error",
        }),
        { status: 500 }
        );
        }
    }
