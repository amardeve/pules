const Joi = require('joi');

const createProjectSchema = Joi.object({
  title: Joi.string().max(250).required(),
  content: Joi.string().required(),
  // categories accepted as comma-separated string or array — we'll allow both
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(100)),
    Joi.string().max(500)
  ).optional()
});

const updateProjectSchema = Joi.object({
  title: Joi.string().max(250).optional(),
  content: Joi.string().optional(),
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(100)),
    Joi.string().max(500)
  ).optional()
}).min(1);

module.exports = { createProjectSchema, updateProjectSchema };
