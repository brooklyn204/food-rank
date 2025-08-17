import { NextResponse } from 'next/server';
import { getContainer } from '../../../lib/cosmosClient';

async function countVotes(voters, numLocations) {
  const votes = new Array(numLocations).fill(0);
  // Compute each voter's vote for each location and add to total location votes
  for (let i=0; i<voters.length; i++) {
    const voter = voters[i];
    const order = voter.orderedLocations;
    const lineLocation = voter.lineLocation;

    // Compute location votes based on the order (weighted borda count algorithm)
    const bonus = (order.length - lineLocation) + 1; // Preferences are taken more seriously for picky voters, but even voters who put all above the line get a little bonus (hardcoded 1 is questionable.. TODO: change to ~20% of total list length??) -- TODO: user approval testing (alternate idea: distance from line if above the line, else 0)
    for (let i=0; i<order.length; i++) {
      const location = order[i];
      const score = order.length - 1 - i; // Earlier in the list = higher preference = higher score
      let vote = 0;
      if (location >= 0 && location < order.length) {
        if (i < lineLocation) {
          // Location score = preference level in list + bonus for being above the line
          vote = bonus + score; 
        } else {
          // Location score = just preference level in list (no bonus)
          vote += score; 
        }
      } // TODO: else case with error handling
      console.log(`User ${voter.name} voted ${vote} for location ${location}`);
      votes[location] += vote;
    }
  }
  return votes;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  // TODO: validate code, redirect to error page if invalid

  console.log('Getting results for:', code);

  // Get group item from database
  // TODO: abstract away item access
  const container = await getContainer();
  const query = {
    query: 'SELECT TOP 1 * FROM c WHERE c.groupCode = @code',
    parameters: [{ name: '@code', value: code }],
  };
  const { resources: items } = await container.items.query(query).fetchAll();
  const item = items.length > 0 ? items[0] : null;
  // TODO: error handling if no items found (item is null)
  const name = item.name || "Defaults"; // TODO: error handling if no name
  const locations = item.locations || []; // TODO: error handling if no locations
  const voters = item.voters || []; // TODO: error handling if no voters
  

  // Ensure the field exists and is a list
  if (!Array.isArray(voters) ) {
    // TODO: better error handling
    throw new Error(`Field ${votersField} is not an array`);
  }
  
  const votes = await countVotes(voters, locations.length);

  // Update each location's votes
  for (let i=0; i<locations.length; i++) {
    if (i<votes.length) {
      locations[i].votes = votes[i];
    } else {
      locations[i].votes = 0;
    }
  }

  console.log(`Computed total votes: ${locations.map(loc => loc.votes)}`);

  return NextResponse.json({ message: `Results for ${code}`, name: name, locations: locations, voters: voters });
}