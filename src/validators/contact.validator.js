const Joi = require('joi');

const createContactSchema = Joi.object({
  firstName: Joi.string().max(100).required(),
  lastName:  Joi.string().max(100).required(),
  email:     Joi.string().email().required(),
  message:   Joi.string().min(3).max(2000).required()
});

const updateContactSchema = Joi.object({
  firstName: Joi.string().max(100).optional(),
  lastName:  Joi.string().max(100).optional(),
  email:     Joi.string().email().optional(),
  message:   Joi.string().min(3).max(2000).optional()
}).min(1);

module.exports = { createContactSchema, updateContactSchema };

