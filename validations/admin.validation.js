const Joi = require("joi");

// CREATE ADMIN
const createAdminSchema = Joi.object({
  full_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/).required(),
  password: Joi.string().min(6).required(),
  is_active: Joi.boolean().default(true),
});

// UPDATE ADMIN (faqat istalgan maydon bo'lishi mumkin, lekin hech bo'lmaganda bittasi)
const updateAdminSchema = Joi.object({
  full_name: Joi.string().min(3).max(100),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
  password: Joi.string().min(6),
  is_active: Joi.boolean(),
}).min(1);

const loginAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
});

module.exports = {
  createAdminSchema,
  updateAdminSchema,
  loginAdminSchema,
  changePasswordSchema,
};
