import { NextResponse } from 'next/server';
import { getContainer } from '../../../lib/cosmosClient';

// TODO: move this to a separate file, maybe lib/utils.js? (don't forget to export + import)
async function generateUniqueGroupCode() {
  const container = await getContainer();
  let code;
  let exists = true;

  while (exists) { // TODO: add a max number of attempts to avoid infinite loop
    // Generate a 6-digit number from 100000–999999
    code = Math.floor(100000 + Math.random() * 899999).toString();

    // Query Cosmos DB to check if the code already exists
    const query = {
      query: 'SELECT TOP 1 * FROM c WHERE c.groupCode = @code',
      parameters: [{ name: '@code', value: code }],
    };

    const { resources } = await container.items.query(query).fetchAll();
    exists = resources.length > 0; // true if we found a match
  }

  return code;
}

export async function POST(request) {
  const body = await request.json();
  
  const groupCode = await generateUniqueGroupCode(); // TODO: make runner or something to clean up codes after some period of time? (May need to log entry time for this)
  console.log('Generated group code:', groupCode);
  body.groupCode = groupCode;

  //TODO: abstract away database access to separate function
  const container = await getContainer();
  const { resource: createdItem } = await container.items.create(body);

  // TODO: unpack, check values, and re-serialize createdItem
  console.log('Creating group:', createdItem.groupCode, 'with name', createdItem.name, 'and locations', createdItem.locations);
  return NextResponse.json({ message: `Created ${createdItem}`, groupCode: groupCode });
}