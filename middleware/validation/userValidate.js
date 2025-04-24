const joi = require("joi");

const registerSchema = joi.object({
  firstName: joi.string().min(3).max(30).required(),
  lastName: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(30).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(30).required(),
});

const updateSchema = joi.object({
  firstName: joi.string().min(3).max(30),
  lastName: joi.string().min(3).max(30),
  email: joi.string().email(),
});

const passwordSchema = joi.object({
  oldPassword: joi.string().min(6).max(30).required(),
  newPassword: joi.string().min(6).max(30).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateSchema,
  passwordSchema,
};
