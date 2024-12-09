import * as Joi from 'joi';

export const ChannelsSchema = Joi.object({
  catalog: Joi.string().optional().allow(''),
  limit: Joi.number().min(10).required(),
  page: Joi.number().min(0).required(),
})