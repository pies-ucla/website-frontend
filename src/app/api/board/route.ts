// app/api/alumni/route.ts
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const response = await fetch('http://localhost:3000/board/');

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch alumni' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}