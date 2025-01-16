import * as Joi from 'joi';

export const UpdateKLoukdoProductSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().optional().allow(''),
  price: Joi.number().optional(),
  category: Joi.string().optional().allow(''),
  subCategory: Joi.string().optional().allow(''),
  photos: Joi.array().items(Joi.object()).optional(),
})
