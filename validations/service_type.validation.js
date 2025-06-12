const Joi = require("joi");

const createServiceTypeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
});

const updateServiceTypeSchema = Joi.object({
  name: Joi.string().min(2).max(100),
}).min(1);

module.exports = {
  createServiceTypeSchema,
  updateServiceTypeSchema,
};
