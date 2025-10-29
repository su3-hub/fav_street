import express from 'express';
import * as snapController from '../controllers/snaps.mjs';
import { catchAsync } from '../utils/catchAsync.mjs';
import { isLoggedIn, validateSnap, isAuthor } from '../middleware.mjs';
import multer from 'multer';
import { storage } from '../cloudinary/index.mjs';
const upload = multer({ storage });

const router = express.Router();

router.route('/')
    .get(catchAsync (snapController.index))
    .post(
        isLoggedIn, 
        upload.array('images'),
        validateSnap,
        catchAsync(snapController.createSnap));

router.route('/new')
    .get(isLoggedIn, snapController.renderNewForm);

router.route('/:id')
    .get(catchAsync (snapController.showDetail))
    .put(isLoggedIn, 
        isAuthor, 
        upload.array('images'),
        validateSnap,
        catchAsync (snapController.updateSnap))
    .delete(isLoggedIn, 
        isAuthor, 
        catchAsync(snapController.deleteSnap));

router.route('/:id/edit')
    .get(isLoggedIn, 
        isAuthor, 
        catchAsync (snapController.renderUpdateForm));

export default router;