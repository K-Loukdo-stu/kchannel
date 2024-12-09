import * as Joi from 'joi';

export const CreateChannelSchema = Joi.object({
  id: Joi.string().optional().allow(''),
  name: Joi.string().required(),
  kind: Joi.string().required(),
  catalog: Joi.string().optional().allow(null, ''),
  bio: Joi.string().optional().allow(''),
  desc: Joi.string().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  email: Joi.string().optional().allow(''),
  website: Joi.string().optional().allow(''),
  productTypes: Joi.array().items(Joi.string()).optional(),
  profile: Joi.object().optional(),
  cover: Joi.object().optional(),
  address: Joi.string().optional().allow(''),
  latitude: Joi.number().optional().allow(''),
  longitude: Joi.number().optional().allow('')

})