const Joi = require("joi");

const createPaymentSchema = Joi.object({
  contract_id: Joi.number().integer().min(1).required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().valid("cash", "card", "transfer").required(),
  paid_at: Joi.date(),
  status: Joi.string().valid("pending", "completed", "cancelled"),
});

const updatePaymentSchema = Joi.object({
  amount: Joi.number().positive(),
  method: Joi.string().valid("cash", "card", "transfer"),
  paid_at: Joi.date(),
  status: Joi.string().valid("pending", "completed", "cancelled"),
}).min(1);

module.exports = {
  createPaymentSchema,
  updatePaymentSchema,
};
