import * as Joi from 'joi';

export const OrderLineTotalSchema = Joi.object({
  channel: Joi.string().required()
})
