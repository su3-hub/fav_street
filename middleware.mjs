import { Snap } from './models/snap.mjs';
import { Review } from './models/review.mjs';
import { snapSchema, reviewSchema } from './schemas.mjs';
import { ExpressError } from './utils/ExpressError.mjs';

export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    };
    next();
};

export const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    };
    next();
};

export const validateSnap = (req, res, next) => {
    console.log('.................validateSnap', req.body)
    const { error } = snapSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(err => err.message).join(',')
        return next(new ExpressError(msg, 400))
    } else {
        next();
    }
};

export const isAuthor = async (req, res, next) => {
    const snap = await Snap.findById(req.params.id);
    if (!snap.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!!');
        return res.redirect(`/snaps/${snap._id}`)
    }
    next();
};

export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!!');
        return res.redirect(`/snaps/${id}`)
    }
    next();
};

export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log('error!!!')
        const msg = error.details.map(err => err.message).join(',')
        return next(new ExpressError(msg, 400))
    } else {
        console.log(req.body)
        next();
    }
};