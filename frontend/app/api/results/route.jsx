import { NextResponse } from 'next/server';
import Location from '../../../lib/models/Location';
import Voter from '../../../lib/models/Voter';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  // TODO: validate code, redirect to error page if invalid

  console.log('Getting results for:', code);

  const name = "My Group";
  const locations = [
      new Location('McDonalds', 'mcdonalds.com', 4),
      new Location('Wendys', 'wendys.com', 7),
      new Location('Chipotle', 'chipotle.com', 6),
      new Location('Arbys', 'arbys.com', 7),
      new Location('Shake Shack', 'shakeshack.com',4),
    ];
    const voterData = [
      new Voter( 
        "Emily",
        [0,3,2,-1,4,1],
        3),
      new Voter( 
      "Josh",
      [4,-1,3,1,0,2],
      1),
      new Voter( 
      "Alex",
      [2,1,3,4,0,-1],
      5),
      new Voter( 
      "Nancy",
      [1,3,4,-1,0,2],
      3)
    ];

  return NextResponse.json({ message: `Results for ${code}`, name: name, locations: locations, voters: voterData });
}