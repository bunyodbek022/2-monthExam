import Joi from "joi";

export const tasksCreateSchema = Joi.object({
  title: Joi.string().min(2).max(20).pattern(/^[^\/$#]+$/).required(),
  description:  Joi.string().min(5).max(100).required(),
  user_id: Joi.string().required(),
  board_id: Joi.string().required(),
  column_id: Joi.string().required()
  
});

export const tasksUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(20).pattern(/^[^\/$#]+$/),
  description:  Joi.string().min(5).max(100),
  user_id: Joi.string().email(),
  board_id: Joi.string().min(6).max(20),
  column_id: Joi.string()
});

