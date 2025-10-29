import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Snap } from '../models/snap.mjs';
import { adj, nown } from './title.mjs';
import { prefecture, city } from './city.mjs';

console.log(adj[Math.floor(Math.random()*adj.length)])
const seedDB = async () => {
    await Snap.deleteMany({});
    // for (let i = 0; i < 50; i++) {
    //     const title = adj[Math.floor(Math.random()*adj.length)] + nown[Math.floor(Math.random()*nown.length)];
    //     const location = prefecture[Math.floor(Math.random()*adj.length)] + city[Math.floor(Math.random()*nown.length)];
    //     const url = `https://picsum.photos/400?random=${Math.random()}`;
    //     const description = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maiores tempora sit consectetur, accusamus repellendus aperiam dolor suscipit sed vel illo similique itaque, dignissimos incidunt quisquam beatae pariatur aliquam expedita. Repellat.'
    //     const author = '68f6549234218ec1dc966c04';
    //     const snap = new Snap({title, location, url, description, author});
    //     await snap.save();
    // };    
}

seedDB().then(()=> {
    mongoose.connection.close();
});

// image: `https://picsum.photos/400?random=${Math.random()}`,