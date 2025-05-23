// app/api/events/route.ts
export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/events/');

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