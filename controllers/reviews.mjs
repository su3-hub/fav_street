import { Snap } from '../models/snap.mjs';
import { Review } from '../models/review.mjs';

export const createReview = async (req, res) => {
    const snap = await Snap.findById(req.params.id);
    const review = new Review(req.body.review);
    console.log(review);
    snap.reviews.push(review);
    review.author = req.user._id;
    await snap.save();
    await review.save();
    req.flash('success', 'Successfully posted your review.')
    res.redirect(`/snaps/${snap._id}`)
};

export const deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Snap.findByIdAndUpdate(id, {$pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review you specified.')
    res.redirect(`/snaps/${id}`);
};