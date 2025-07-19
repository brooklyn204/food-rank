import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const votes = body.votes;

  console.log('Saving votes:', votes); // or save to DB, etc.

  return NextResponse.json({ message: `Saving ${votes}` });
}