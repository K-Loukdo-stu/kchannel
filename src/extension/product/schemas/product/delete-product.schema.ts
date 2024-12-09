import * as Joi from 'joi';

export const DeleteProductSchema = Joi.object({
  id: Joi.string().required()
})
