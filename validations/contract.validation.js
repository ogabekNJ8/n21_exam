const Joi = require("joi");

const createContractSchema = Joi.object({
  client_id: Joi.number().integer().min(1).required(),
  scheduled_date: Joi.date().required(),
  notes: Joi.string().required(),
  address: Joi.string().required(),
  event_date: Joi.date().required(),
  event_time: Joi.date().required(),
  total_amount: Joi.number().precision(2).required(),
  status: Joi.string()
    .valid("pending", "approved", "rejected", "in_progress", "completed")
    .required(),
  cancelled_reason: Joi.string().allow(null, ""),
  is_cancelled: Joi.boolean().required(),
  wedding_service_ids: Joi.array()
    .items(Joi.number().integer().min(1))
    .min(1)
    .required(), // ko‘pga-ko‘p
});

const updateContractSchema = Joi.object({
  scheduled_date: Joi.date(),
  notes: Joi.string(),
  address: Joi.string(),
  event_date: Joi.date(),
  event_time: Joi.date(),
  total_amount: Joi.number().precision(2),
  status: Joi.string().valid(
    "pending",
    "approved",
    "rejected",
    "in_progress",
    "completed"
  ),
  cancelled_reason: Joi.string().allow(null, ""),
  is_cancelled: Joi.boolean(),
  wedding_service_ids: Joi.array().items(Joi.number().integer().min(1)).min(1),
});

module.exports = {
  createContractSchema,
  updateContractSchema,
};
