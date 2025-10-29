import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
.then(()=> console.log('Mongo connection open!'))
.catch((err)=> console.log('Mongo connection error.'));

const reviewSchema = new Schema({
    body: {
        type: String,
        required: [true, "Cannot be blank"]
    }, 
    rating: {
        type: Number,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

export const Review = mongoose.model('Review', reviewSchema);