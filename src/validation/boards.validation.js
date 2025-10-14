import Joi from "joi";

export const boardCreateSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    user_id: Joi.required()
    });

export const boardUpdateSchema = Joi.object({
    title : Joi.string().min(3).max(30).required()
  });
