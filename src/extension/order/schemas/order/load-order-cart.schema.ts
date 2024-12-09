import * as Joi from 'joi';

export const LoadOrderCartSchema = Joi.object({
  channel: Joi.string().required(),
});