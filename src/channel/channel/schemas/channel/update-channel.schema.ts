import * as Joi from 'joi';

export const UpdateChannelSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  catalog: Joi.string().optional().allow(''),
  bio: Joi.string().optional().allow(''),
  desc: Joi.string().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  email: Joi.string().optional().allow(''),
  website: Joi.string().optional().allow(''),
  productTypes: Joi.array().items(Joi.string()).optional(),
  profile: Joi.object().optional(),
  cover: Joi.object().optional()
})
