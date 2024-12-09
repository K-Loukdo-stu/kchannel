import { Currency } from '@htkradass/common';
import * as Joi from 'joi';

export const CheckoutACartSchema = Joi.object({
  orderId: Joi.string().required(),
  subTotal: Joi.number().required(),
  discount: Joi.number().required(),
  delivery: Joi.number().required(),
  total: Joi.number().required(),
  acceptingCurrency: Joi.string().valid(Currency.KHR.code, Currency.USD.code).required(),
  usdExchangeRateInRiel: Joi.number().positive().required(),
  hasCurrencyConversion: Joi.boolean().required(),
});
