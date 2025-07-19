import { NextResponse } from 'next/server';
import Location from '../../../lib/models/Location';
import Voter from '../../../lib/models/Voter';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  // TODO: validate code, redirect to error page if invalid

  console.log('Getting results for:', code);

  // TODO: get from DB, return options in order the were entered

  const name = "My Group";
  const locations = [
      new Location('McDonalds', 'mcdonalds.com', 4),
      new Location('Wendys', 'wendys.com', 7),
      new Location('Chipotle', 'chipotle.com', 6),
      new Location('Arbys', 'arbys.com', 7),
      new Location('Shake Shack', 'shakeshack.com',4),
    ];

  return NextResponse.json({ message: `Results for ${code}`, name: name, locations: locations });
}