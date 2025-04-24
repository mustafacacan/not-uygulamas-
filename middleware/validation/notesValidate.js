const Joi = require("joi");

const notesSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  content: Joi.string().min(10).max(600).required(),
});

module.exports = notesSchema;
