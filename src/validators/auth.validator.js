

const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  // optional role field — in production only allow admins to assign roles
  role: Joi.string().valid('user', 'admin').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
