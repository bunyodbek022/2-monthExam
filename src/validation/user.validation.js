import Joi from "joi";

export const userCreateSchema = Joi.object({
  name: Joi.string().min(2).max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(25),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(20),
});

