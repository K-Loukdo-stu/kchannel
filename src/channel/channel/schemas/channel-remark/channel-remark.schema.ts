import Joi from "joi";

export const ChannelRemarkSchema = Joi.object({
   id: Joi.string().required(),
})