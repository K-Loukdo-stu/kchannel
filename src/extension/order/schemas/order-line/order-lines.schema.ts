import * as Joi from 'joi';

export const OrderLinesSchema = Joi.object({
  orderId: Joi.string().required()
})
