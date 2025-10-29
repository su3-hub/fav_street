import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Review } from './review.mjs';

const opts = { toJSON: { virtuals: true } };
// https://res.cloudinary.com/dtpqdkl1w/image/upload/e_cartoonify/v1761228654/fav-street/z68wi0qhaahv4mife9px.jpg
const ImageSchema = new Schema({        
    url: String,
    filename: String,
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_150');
});

const SnapSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    images: {
        type: [ImageSchema],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    description: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    tag: {
        type: String,
        lowercase: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

SnapSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/snaps/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>
    `
});

SnapSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        const res = await Review.deleteMany({_id: {$in: doc.reviews}})
        console.log('REEEES', res);
    }
});

export const Snap = mongoose.model('Snap', SnapSchema);