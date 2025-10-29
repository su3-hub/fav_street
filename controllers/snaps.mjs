import * as maptilerClient  from '@maptiler/client';
import { Snap } from '../models/snap.mjs';
import { ExpressError } from '../utils/ExpressError.mjs';
import { cloudinary } from '../cloudinary/index.mjs';

maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

export const index = async (req, res) => {
    const snaps = await Snap.find();
    res.render('snaps/index', {snaps});
};

export const renderNewForm = (req, res) => {
    res.render('snaps/new');
};

export const createSnap = async (req, res, next) => {
    const snap = new Snap(req.body.snap);
    const geoData = await maptilerClient.geocoding.forward(req.body.snap.location, { limit: 1});
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please tyr again.');
        return res.redirect('/snaps/new');
    };
    snap.geometry = geoData.features[0].geometry;
    snap.location = geoData.features[0].place_name;

    snap.images = req.files.map(image => ({ url:image.path, filename: image.filename }));
    snap.author = req.user._id;
    await snap.save();
    req.flash('success', 'Successfully made a new snap!');
    res.redirect(`/snaps/${snap._id}`);
};

export const showDetail = async (req, res, next) => {
    const snap = await Snap.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'}
        }).populate('author');
    if (!snap) {
        console.log('cannot find!')
        req.flash('error', 'Cannot find that snap.');
        return res.redirect('/snaps')
    }
    res.render('snaps/show', {snap});
};

export const renderUpdateForm = async (req, res, next) => {
    const snap = await Snap.findById(req.params.id);
    if (!snap) return next(new ExpressError('Not found specified page.', 400));
    res.render('snaps/edit', { snap });
};

export const updateSnap = async (req, res, next) => {
    const snap = await Snap.findByIdAndUpdate(req.params.id, {...req.body.snap});

    const geoData = await maptilerClient.geocoding.forward(req.body.snap.location, { limit: 1 });
    console.log('updateSnap',req.body)
    if (!geoData.features?.length) {
        req.flash('error', 'Could not find that location. Please try again.');
        return res.redirect(`/snaps/${snap._id}/edit`);
    };
    snap.geometry = geoData.features[0].geometry;
    snap.location = geoData.features[0].place_name;

    const images = req.files.map(image => ({ url: image.path, filename: image.filename }));
    snap.images.push(...images);
    if (!snap.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!!');
        return res.redirect(`/snaps/${snap._id}`)
    };
    await snap.save();
    console.log('DELETE ID:', req.body.deleteImages)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await snap.updateOne({$pull: {images: { filename: { $in: req.body.deleteImages }}}})
        console.log('AFTER DELETE',snap);
    }
    req.flash('success', 'Successfully updated snap info.')
    res.redirect(`/snaps/${snap._id}`)
};

export const deleteSnap = async (req, res) => {
    const deletedItem = await Snap.findByIdAndDelete(req.params.id);
    console.log('deleted following item', deletedItem);
    req.flash('success', 'Successfully deleted snap you specified.')
    res.redirect('/snaps');
};

