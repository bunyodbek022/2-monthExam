import Joi from "joi";

export function userValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(25).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return schema.validate(data, { abortEarly: true });
}

export function userValidationUpdate(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(25),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(20),
  });

  return schema.validate(data, { abortEarly: true });
}
