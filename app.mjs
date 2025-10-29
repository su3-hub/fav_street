import dotenv from 'dotenv';
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
};

import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import expressMongoSanitize from '@exortek/express-mongo-sanitize';
import helmet from 'helmet';

import { User } from './models/user.mjs';
import { ExpressError } from './utils/ExpressError.mjs';
import snapRouter from './routes/snap.mjs';
import reviewRouter from './routes/reviews.mjs';
import userRouter from './routes/users.mjs';

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
.then(()=> console.log('Mongo connection open!'))
.catch((err)=> console.log('Mongo connection error.'));

const app = express();

const __dirname = import.meta.dirname;
app.engine('ejs', ejsMate);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expressMongoSanitize({ replaceWith: '_'}));

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!',
    }
});

store.on('error', function(e) {
    console.log('SESSION STORE ERROR', e)
});

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
    "https://cdn.maptiler.com",
    "https://cdn.jsdelivr.net",
];

app.use(helmet({ 
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: ["'none'"],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dtpqdkl1w/",
                "https://api.maptiler.com/",
            ],
        }
    }
 }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/snaps', snapRouter);
app.use('/snaps/:id/reviews', reviewRouter);
app.use('/', userRouter);

app.get('/', (req, res) => {
    res.render('home');
})

app.all(/(.*)/, (req, res, next) => {
    // console.log(`❌ 404 Catchall: ${req.method} ❌ ${req.originalUrl}`);
    return next(new ExpressError('Page Not Found!', 404));
})

app.use((err, req, res, next) => {
    console.log(`❌ 404 lastErrorPart: ${req.method} ❌ ${req.originalUrl}`);
    const {statusCode=500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    console.log('@@@ FROM HERE @@@@');
    console.log(err);
    console.log('@@@ TO HERE @@@@');
    res.status(statusCode).render('error', { err });
});

app.listen('3000', ()=> {
    console.log('Listening port on 3000!!!');
});