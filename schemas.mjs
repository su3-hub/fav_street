import BaseJoi from "joi";
import sanitizeHtml from "sanitize-html";

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

export const snapSchema = Joi.object({
    snap: Joi.object({
        title: Joi.string().required().escapeHTML(),     
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().allow('').escapeHTML(),
    }).required(),
    images: Joi.array(),
    deleteImages: Joi.array(),
});

export const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(1).max(5),
    }).required()
});