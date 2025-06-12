const Joi = require("joi");

const phoneRegex = /^\d{2}-\d{3}-\d{2}-\d{2}$/;

const createOwnerSchema = Joi.object({
  full_name: Joi.string().min(3).max(100).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

const loginOwnerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateOwnerSchema = Joi.object({
  full_name: Joi.string().min(3).max(100),
  phone: Joi.string().pattern(phoneRegex),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(50),
}).min(1); // kamida 1 field bo‘lishi kerak

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(6).max(50).required(),
});

module.exports = {
  createOwnerSchema,
  loginOwnerSchema,
  updateOwnerSchema,
  changePasswordSchema,
};
