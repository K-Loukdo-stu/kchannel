import * as Joi from 'joi';

export const DeleteKLoukdoProductSchema = Joi.object({
  id: Joi.string().required(),
})
