import Joi from "joi";

export const SubscribeChannelExtensionSchema = Joi.object({
    extension: Joi.string().required(),
    channel: Joi.string().required(),
})