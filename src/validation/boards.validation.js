import Joi from "joi";

export function boardValidation(data){
    const scheme = Joi.object({
        title: Joi.string().required(),
        user_id: Joi.required()
    });

    return scheme.validate(data, { abortEarly: true });
}

export function boardValidationUpdate(data) {
  const schema = Joi.object({
    title : Joi.string().required()
  });
  return schema.validate(data, { abortEarly: true });
}