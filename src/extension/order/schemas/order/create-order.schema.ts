import * as Joi from 'joi';

export const CreateOrderSchema = Joi.object({
  id: Joi.string().optional().allow(''),
  createdBy: Joi.string().required(),
  channel: Joi.string().required(),
  location: Joi.string().required(),
  contact: Joi.string().required(),
  stateOrdering: Joi.string().required(),
  fee: Joi.number().required(),
  delivery: Joi.number().required(),
  subTotal: Joi.number().required(),
  total: Joi.number().required(),
})