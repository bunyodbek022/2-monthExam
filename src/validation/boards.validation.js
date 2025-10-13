import Joi from "joi";

export const boardCreateSchema = Joi.object({
    title: Joi.string().required(),
    user_id: Joi.required()
    });

export const boardUpdateSchema = Joi.object({
    title : Joi.string().required()
  });
