import * as Joi from 'joi';

export const DeleteChannelSchema = Joi.object({
  id: Joi.string().required()
})
