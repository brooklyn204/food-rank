import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const code = body.code;
  const name = body.name;
  const votes = body.order;

  console.log('Saving votes:', votes, 'for', name); // or save to DB, etc.

  return NextResponse.json({ message: `Saving ${votes}` });
}