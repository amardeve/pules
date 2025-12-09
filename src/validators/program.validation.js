const Joi = require("joi");

exports.createProgramSchema = Joi.object({
  logo: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
});

exports.updateProgramSchema = Joi.object({
  logo: Joi.string().optional(),
  title: Joi.string().optional(),
  content: Joi.string().optional(),
});
