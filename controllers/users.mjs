import { User } from '../models/user.mjs';
import { Snap } from '../models/snap.mjs';

export const renderRegisterForm = (req, res) => {
    const keptData = req.flash('keep')[0] || {};
    const {username='', email='' } = keptData;
    res.render('users/register', {username, email});
};

export const registerNewUser = async(req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body)
    try {
        const user = new User({ username, email });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Fav-snap!');
            res.redirect('/snaps')
        });
    } catch (err) {
        req.flash('keep', {username, email});
        req.flash('error', err.message);
        res.redirect('/register');
    }       
};

export const renderLoginForm = (req, res) => {
    res.render('users/login');
};

export const login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/snaps';
    res.redirect(redirectUrl);
};

export const backAfterLogin = async (req, res) => {
    const snap = await Snap.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'}
    })
    .populate('author')
    res.render('snaps/show', {snap});
};

export const logout = async (req, res) => {
    await req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Goodbye!');
        res.redirect('/snaps');
    });
};