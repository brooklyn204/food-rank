import { NextResponse } from 'next/server';
import { getContainer } from '../../../lib/cosmosClient';
import Voter from '../../../lib/models/Voter';

export async function POST(request) {
  const body = await request.json();
  const code = body.code;
  const name = body.name;
  const order = body.order;

  console.log(`Received votes for group ${code} from ${name}: ${order}`);

  // Get voter attributes from request
  const lineLocation = order.indexOf(-1);
  order.splice(lineLocation, 1);
  // TODO: EXTENSIVE error handling (check if lineLocation is -1 (before splicing), check if all items in orderedLocations are valid, etc.)

  // Create voter object
  const voter = new Voter(name, order, lineLocation);

  // Compute location votes based on the order (weighted borda count algorithm)
  const bonus = (order.length - lineLocation) + 1; // Preferences are taken more seriously for picky voters, but even voters who put all above the line get a little bonus (hardcoded 1 is questionable.. TODO: change to ~20% of total list length??) -- TODO: user approval testing (alternate idea: distance from line if above the line, else 0)
  const votes = new Array(order.length).fill(0);
  for (let i=0; i<order.length; i++) {
    const location = order[i];
    const score = order.length - 1 - i; // Earlier in the list = higher preference = higher score
    if (location >= 0 && location < order.length) {
      if (i < lineLocation) {
        // Location score = preference level in list + bonus for being above the line
        votes[location] = bonus + score; 
      } else {
        // Location score = just preference level in list (no bonus)
        votes[location] = score; 
      }
    } // TODO: else case with error handling
  }

  console.log(`Computed votes: ${votes} for user ${name}`);

  // Get group item from database
  // TODO: abstract away item access
  const container = await getContainer();
  const query = {
    query: 'SELECT TOP 1 * FROM c WHERE c.groupCode = @code',
    parameters: [{ name: '@code', value: code }],
  };
  const { resources: items } = await container.items.query(query).fetchAll();
  const item = items.length > 0 ? items[0] : null;
  const partitionKey = item.id;
  // TODO: error handling if no items found (item is null)

  // Save user's votes
  // Ensure the field exists and is a list
  const votersField = "voters";
  if (!Array.isArray(item[votersField]) ) {
    if (item[votersField] === undefined) {
    item[votersField] = [];
    } else {
      // TODO: better error handling
      throw new Error(`Field ${votersField} exists but is not an array`);
    }
  }

  // Add the voter to the array in the database item
  console.log(`Adding voter ${JSON.stringify(voter)} to item ${JSON.stringify(item)}\n`);
  item[votersField].push(voter);

  // Update each location's votes
  for (let i=0; i<item.locations.length && i<votes.length; i++) {
    if (typeof item.locations[i].votes !== 'number') { // TODO: change to const variable for type string
      item.locations[i].votes = 0; // Initialize if not present or not a number
    }
    item.locations[i].votes += votes[i];
  }

  // Replace the document
  const { resource: updatedItem } = await container
    .item(partitionKey, partitionKey)
    .replace(item);

  console.log(`Saved item ${JSON.stringify(item)}\n`);
  
  return NextResponse.json({ message: `Saving ${votes}` });
}