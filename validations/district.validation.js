const Joi = require("joi");

const districtSchema = Joi.object({
  region_id: Joi.number().integer().required(),
  name: Joi.string().max(255).required(),
});

const updateDistrictSchema = Joi.object({
  region_id: Joi.number().integer(),
  name: Joi.string().max(255),
}).min(1);

const districtIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  districtSchema,
  updateDistrictSchema,
  districtIdSchema,
};
