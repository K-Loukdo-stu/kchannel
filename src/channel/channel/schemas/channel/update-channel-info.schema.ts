import * as Joi from 'joi';

export const UpdateChannelInfoSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  catalog: Joi.string().optional().allow(null),
  bio: Joi.string().optional().allow('', null),
  desc: Joi.string().optional().allow('', null),
  phone: Joi.string().optional().allow('', null),
  email: Joi.string().optional().allow('', null),
  website: Joi.string().optional().allow('', null),
  usdExchangeRateInRiel: Joi.string().optional().allow('', null),
  acceptingCurrency: Joi.string().optional().allow('', null),
  public: Joi.boolean().required(),
})
