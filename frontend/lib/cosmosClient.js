import { CosmosClient } from '@azure/cosmos';

export async function getContainer() {
    const endpoint = process.env.COSMOS_DB_ENDPOINT;
    const key = process.env.COSMOS_DB_KEY;
    const client = new CosmosClient({ endpoint, key });
    const databaseId = 'food-finder';
    const containerId = 'groups';
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container } = await database.containers.createIfNotExists({ id: containerId });
    return container;
}