import * as Joi from 'joi';

export const OrderingSchema = Joi.object({
  inProcessStatus: Joi.string().optional(),
  channel: Joi.string().optional(),
}).or("inProcessStatus", "channel");
