import express from 'express';
import passport from 'passport';
import * as userController from '../controllers/users.mjs';
import { catchAsync } from '../utils/catchAsync.mjs';

import { storeReturnTo, isLoggedIn } from '../middleware.mjs';

const router = express.Router();

router.route('/register')
.get(userController.renderRegisterForm)
.post(catchAsync(userController.registerNewUser));

router.route('/login')
.get(userController.renderLoginForm)
.post(storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    userController.login);

router.get('/login/:id', isLoggedIn, userController.backAfterLogin);

router.get('/logout', catchAsync(userController.logout));

export default router;