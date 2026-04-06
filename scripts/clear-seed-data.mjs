import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const client = new ConvexHttpClient('https://quiet-oriole-943.convex.cloud');
const result = await client.mutation(api.intelligence.clearSeedData, {});
console.log('Deleted:', result);
