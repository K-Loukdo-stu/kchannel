import * as Joi from 'joi';

export const UpdateChannelAddressSchema = Joi.object({
  id: Joi.string().required(),
  address: Joi.string().optional().allow(''),
  latitude: Joi.number().optional().allow(''),
  longitude: Joi.number().optional().allow(''),
})
