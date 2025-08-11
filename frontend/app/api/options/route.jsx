import { NextResponse } from 'next/server';
import { getContainer } from '../../../lib/cosmosClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const container = await getContainer();

  // TODO: validate code, redirect to error page if invalid

  console.log('Getting results for:', code);

  const query = {
      query: 'SELECT TOP 1 * FROM c WHERE c.groupCode = @code',
      parameters: [{ name: '@code', value: code }],
    };
  const { resources: items } = await container.items.query(query).fetchAll();
  const item = items.length > 0 ? items[0] : null; // TODO: error handling if no items found
  console.log('Got item:', item);

  return NextResponse.json({ message: `Results for ${code}`, name: item.name, locations: item.locations });
}