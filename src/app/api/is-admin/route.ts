// app/api/is-admin/route.ts
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const API_URL =  process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
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

    // Fetch all users and find the one matching the token's userId
    const res = await fetch(`${API_URL}/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), { status: 500 });
    }

    const users = await res.json();
    const currentUser = users.find((u: { pk: number }) => u.pk === userId);

    if (!currentUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const isAdmin = currentUser.position === 'admin';

    return new Response(JSON.stringify({ isAdmin }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error verifying or fetching user:", err);
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
  }
}
