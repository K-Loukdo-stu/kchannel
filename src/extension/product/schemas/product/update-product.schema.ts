import * as Joi from 'joi';

export const UpdateProductSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().optional().allow(''),
  productType: Joi.string().optional().allow(''),
  photo: Joi.object().optional()
})
