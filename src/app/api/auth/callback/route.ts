// app/api/auth/callback/route.ts

export async function POST(request: Request) {
    try {
        console.log("codeine");
        const { code, redirect_uri } = await request.json();
        const response = await fetch("http://localhost:8000/token/get/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code, redirect_uri }),
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
            "Content-Type": "application/json",
        },
        });
    } catch (error: any) {
        return new Response(
        JSON.stringify({
            error: "Token exchange failed",
            details: error?.message || "Unknown error",
        }),
        { status: 500 }
        );
        }
    }
