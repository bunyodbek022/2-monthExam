import Joi from "joi";

export const columnsCreateSchema = Joi.object({
    name: Joi.string().min(3).max(30).pattern(/^[^\/$#0-9]+$/).required(),
    board_id: Joi.string().required()
    
    });

export const columnsUpdateSchema = Joi.object({
    name : Joi.string().min(3).max(30).pattern(/^[^\/$#0-9]+$/),
    board_id: Joi.string()
  });
