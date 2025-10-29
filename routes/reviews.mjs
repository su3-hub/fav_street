import express from 'express';
import * as reviewController from '../controllers/reviews.mjs';

import { catchAsync } from '../utils/catchAsync.mjs';
import { isLoggedIn, isReviewAuthor, validateReview } from '../middleware.mjs'

const router = express.Router({ mergeParams: true });

router.post('/', 
    isLoggedIn, 
    validateReview, 
    catchAsync (reviewController.createReview)
);

router.delete('/:reviewId', 
    isLoggedIn, 
    isReviewAuthor, 
    catchAsync(reviewController.deleteReview)
);

export default router;