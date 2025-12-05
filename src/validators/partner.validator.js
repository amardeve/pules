const Joi = require('joi');

const partnerSchema = Joi.object({
  name: Joi.string().max(200).required(),
  content: Joi.string().required(),
  image: Joi.string().uri().optional().allow('', null) // optional url
});

module.exports = { partnerSchema };
