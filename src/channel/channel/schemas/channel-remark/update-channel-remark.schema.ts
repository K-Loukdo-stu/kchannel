import Joi from "joi";

export const UpdateChannelRemarkSchema = Joi.object({
   id: Joi.string().required(),
   name: Joi.string().required(),
   desc: Joi.string().optional().allow(''),
   channel: Joi.string().required(),
   type: Joi.string().required(),
   validationValues: Joi.array().items(Joi.string()).optional(),
   isRequired: Joi.boolean().required(),
   isEnable: Joi.boolean().required(),
})