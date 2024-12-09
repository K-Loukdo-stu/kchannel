import * as Joi from 'joi';

export const UpdateStatusSchema = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().required(),
})
