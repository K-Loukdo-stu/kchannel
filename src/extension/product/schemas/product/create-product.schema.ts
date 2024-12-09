import { Currency } from '@htkradass/common';
import * as Joi from 'joi';

export const CreateProductSchema = Joi.object({
  id: Joi.string().optional().allow(''),
  name: Joi.string().required(),
  productType: Joi.string().required(),
  channel: Joi.string().required(),
  photo: Joi.object().optional(),
  price: Joi.number().optional().default(0),
  discountPrice: Joi.number().default(0),
  hasDiscount: Joi.boolean().required(),
  currency: Joi.string().valid(Currency.KHR.code, Currency.USD.code).required(),
})