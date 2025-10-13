import Joi from "joi";

export const columnsCreateSchema = Joi.object({
    name: Joi.string().required(),
    board_id: Joi.string().required
    
    });

export const columnsUpdateSchema = Joi.object({
    name : Joi.string(),
    board_id: Joi.string()
  });
