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

        const rawBody = await response.text();
        let data;
        try {
            data = JSON.parse(rawBody);
        } catch {
            console.error(
                `Token exchange to ${API_URL}/token/get/ returned non-JSON (status ${response.status}):`,
                rawBody.slice(0, 500)
            );
            return new Response(
                JSON.stringify({
                    error: "Token exchange failed",
                    details: `Backend returned ${response.status} with a non-JSON body`,
                }),
                { status: 502 }
            );
        }

        if (!response.ok) {
            return new Response(JSON.stringify(data), {
                status: response.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        cookieStore.set({
            name: 'access_token',
            value: data.access,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24
        });
        cookieStore.set({
            name: 'refresh_token',
            value: data.refresh,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 3
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
