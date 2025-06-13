const Joi = require("joi");

const createContractServiceSchema = Joi.object({
  contract_id: Joi.number().integer().min(1).required(),
  wedding_service_id: Joi.number().integer().min(1).required(),
});

const updateContractServiceSchema = Joi.object({
  contract_id: Joi.number().integer().min(1),
  wedding_service_id: Joi.number().integer().min(1),
}).min(1);

module.exports = {
  createContractServiceSchema,
  updateContractServiceSchema,
};
