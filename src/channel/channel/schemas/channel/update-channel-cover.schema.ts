import * as Joi from 'joi';

export const UpdateChannelCoverSchema = Joi.object({
  id: Joi.string().required(),
  cover: Joi.object().required(),
})
