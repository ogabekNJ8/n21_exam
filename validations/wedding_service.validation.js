const Joi = require("joi");

const createWeddingServiceSchema = Joi.object({
  owner_id: Joi.number().integer().required(),
  service_type_id: Joi.number().integer().required(),
  district_id: Joi.number().integer().required(),
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow(null, ""),
  price: Joi.number().positive().required(),
  duration: Joi.number().integer().positive().allow(null),
  available_from: Joi.date().allow(null),
  available_to: Joi.date().greater(Joi.ref("available_from")).allow(null),
  is_active: Joi.boolean(),
});

const updateWeddingServiceSchema = Joi.object({
  owner_id: Joi.number().integer(),
  service_type_id: Joi.number().integer(),
  district_id: Joi.number().integer(),
  title: Joi.string().min(3).max(100),
  description: Joi.string().allow(null, ""),
  price: Joi.number().positive(),
  duration: Joi.number().integer().positive().allow(null),
  available_from: Joi.date().allow(null),
  available_to: Joi.date().greater(Joi.ref("available_from")).allow(null),
  is_active: Joi.boolean(),
});

module.exports = {
  createWeddingServiceSchema,
  updateWeddingServiceSchema,
};
