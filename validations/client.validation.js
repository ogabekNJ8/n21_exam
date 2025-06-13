const Joi = require("joi");

const phoneRegex = /^\d{2}-\d{3}-\d{2}-\d{2}$/;

const createClientSchema = Joi.object({
  full_name: Joi.string().min(3).max(100).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

const loginClientSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateClientSchema = Joi.object({
  full_name: Joi.string().min(3).max(100),
  phone: Joi.string().pattern(phoneRegex),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(50),
}).min(1); 

const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(6).max(50).required(),
});

module.exports = {
  createClientSchema,
  loginClientSchema,
  updateClientSchema,
  changePasswordSchema,
};
