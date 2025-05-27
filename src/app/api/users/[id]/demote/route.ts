// app/api/users/[userId]/demote/route.ts
import { cookies } from 'next/headers';

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getToken();
  const param = await params;
  const id = await param.id;

  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const res = await fetch(`http://localhost:8000/users/${id}/demote/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
}
