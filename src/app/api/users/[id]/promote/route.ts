// app/api/users/[userId]/demote/route.ts
import { cookies } from 'next/headers';

export async function POST(_: Request, { params }: { params: { userId: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const res = await fetch(`http://localhost:8000/users/${params.userId}/promote/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
}
