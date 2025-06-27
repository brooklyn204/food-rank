import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const name = body.name;

  console.log('Received name:', name); // or save to DB, etc.

  return NextResponse.json({ message: `Hello, ${name}` });
}