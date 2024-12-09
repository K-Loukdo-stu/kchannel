import * as Joi from "joi";

export const UpdateChannelRemarkEnableSchema = Joi.object({
   id: Joi.string().required(),
   isEnable: Joi.boolean().required(),
})