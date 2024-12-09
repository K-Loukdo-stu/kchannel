import * as Joi from 'joi';

export const UpdateOrderSchema = Joi.object({
  id: Joi.string().required(),
  location: Joi.string().required(),
  contact: Joi.string().required(),
  stateOrdering: Joi.string().required(),
})
