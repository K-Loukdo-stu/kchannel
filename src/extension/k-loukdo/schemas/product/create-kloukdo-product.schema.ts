import { Currency } from '@htkradass/common';
import * as Joi from 'joi';

export const CreateKLoukdoProductSchema = Joi.object({
  id: Joi.string().optional().allow(''),
  name: Joi.string().required(),
  category: Joi.string().required(),
  subCategory: Joi.string().required(),
  // user: Joi.string().required(),
  photos: Joi.array().items(Joi.object().optional()).optional(),
  price: Joi.number().optional().default(0),
  discountPrice: Joi.number().optional().default(0),
  hasDiscount: Joi.boolean().required(),
  currency: Joi.string().valid(Currency.KHR.code, Currency.USD.code).required(),
})