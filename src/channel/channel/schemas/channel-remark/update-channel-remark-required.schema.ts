import * as Joi from "joi";

export const UpdateChannelRemarkRequiredSchema = Joi.object({
   id: Joi.string().required(),
   isRequired: Joi.boolean().required(),
})