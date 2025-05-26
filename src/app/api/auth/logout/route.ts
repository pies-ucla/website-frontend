// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // Clear any session tokens
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  return new Response(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}