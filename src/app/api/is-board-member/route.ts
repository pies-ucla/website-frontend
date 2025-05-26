// app/api/is-board-member/route.ts
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // Must match Django's signing key

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    // Decode and verify the JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.user_id || payload.id || payload.sub;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    // Now fetch board members using the token
    const res = await fetch('http://localhost:8000/board/', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch board members" }), { status: 500 });
    }

    const boardMembers = await res.json();
    const isMember = boardMembers.some((bm: any) => bm.user.pk === userId);

    return new Response(JSON.stringify({ isBoardMember: isMember }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("JWT decoding failed:", err);
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
  }
}