const Joi = require('joi');

const createNewsSchema = Joi.object({
  title: Joi.string().max(300).required(),
  content: Joi.string().min(1).required(),
  // categories: either array or comma-separated string
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(100)),
    Joi.string().max(500)
  ).optional(),
  // images when sent as JSON: array of URLs
  images: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string()
  ).optional()
});

const updateNewsSchema = Joi.object({
  title: Joi.string().max(300).optional(),
  content: Joi.string().optional(),
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(100)),
    Joi.string().max(500)
  ).optional(),
  images: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string()
  ).optional()
}).min(1);

module.exports = { createNewsSchema, updateNewsSchema };
