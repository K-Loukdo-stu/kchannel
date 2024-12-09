import * as Joi from 'joi';

export const UpdateChannelProfileSchema = Joi.object({
  id: Joi.string().required(),
  profile: Joi.object(),
  cover: Joi.object(),
}).or('profile', 'cover');
