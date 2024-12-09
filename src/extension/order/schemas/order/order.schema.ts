import * as Joi from 'joi';

export const OrderSchema = Joi.object({
  id: Joi.string().optional(),
  channel: Joi.string().optional(),
}).or("id", "channel");
