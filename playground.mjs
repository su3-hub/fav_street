import dotenv from 'dotenv';
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
import * as maptilerClient  from '@maptiler/client';
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

async function findGeo () {
    const geoData = await maptilerClient.geocoding.forward('越谷市', { limit: 1})
    console.log(geoData);
}

findGeo();

