import Joi from "joi";

export const CreateChannelRemarkSchema = Joi.object({
   name: Joi.string().required(),
   desc: Joi.string().optional().allow(''),
   channel: Joi.string().required(),
   validationValues: Joi.array().items(Joi.string()).optional(),
   type: Joi.string().required(),
   isRequired: Joi.boolean().required(),
   isEnable: Joi.boolean().required(),
})