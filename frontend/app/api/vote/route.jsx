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

  // Create voter object
  const voter = new Voter(name, order, lineLocation);

  // Save user's votes
  // Ensure the field exists and is a list
  if (!Array.isArray(item.voters) ) {
    if (item.voters === undefined) {
    item.voters = [];
    } else {
      // TODO: better error handling
      throw new Error(`Field ${votersField} exists but is not an array`);
    }
  }

  // Add the voter to the array in the database item
  console.log(`Adding voter ${JSON.stringify(voter)} to item ${JSON.stringify(item)}\n`);
  item.voters.push(voter);

  // Replace the document
  const { resource: updatedItem } = await container
    .item(partitionKey, partitionKey)
    .replace(item);

  console.log(`Saved item ${JSON.stringify(item)}\n`);
  
  return NextResponse.json({ message: `Saving ${voter}` });
}