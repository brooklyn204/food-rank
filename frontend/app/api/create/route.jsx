import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const groupName = body.name;
  const locations = body.locations; 
  const groupId = 1234;

  console.log('Creating group:', groupId, 'with name', groupName, 'and locations', locations); // or save to DB, etc.

  return NextResponse.json({ message: `Created ${groupId}`, groupId: groupId });
}