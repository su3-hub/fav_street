import * as maptilerClient from '@maptiler/client';

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

console.log('Maptiler Client API Key Set:', !!maptilerClient.config.apiKey);