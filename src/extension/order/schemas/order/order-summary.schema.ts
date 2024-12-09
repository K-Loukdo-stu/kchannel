import * as Joi from 'joi';

export const OrderSummarySchema = Joi.object({
  orderId: Joi.string().optional(),
});
