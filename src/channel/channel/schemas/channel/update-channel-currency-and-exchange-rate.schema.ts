import { Currency } from '@htkradass/common';
import * as Joi from 'joi';

export const UpdateChannelCurrencyAndExchangeRateSchema = Joi.object({
  channelId: Joi.string().required(),
  currencyCode: Joi.string().valid(Currency.KHR.code, Currency.USD.code).required(),
  usdExchangeRateInRiel: Joi.number().min(0).required(),
})
