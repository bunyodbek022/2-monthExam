import Joi from "joi";

export const tasksCreateSchema = Joi.object({
    title: Joi.string().min(2).max(20).required(),
    description:  Joi.string().min(5).max(100).required(),
  user_id: Joi.string().required(),
  board_id: Joi.string().required(),
  colums_id: Joi.string().required()
  
});

export const tasksUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(20),
  description:  Joi.string().min(5).max(100),
  user_id: Joi.string().email(),
  board_id: Joi.string().min(6).max(20),
  colums_id: Joi.string()
});

