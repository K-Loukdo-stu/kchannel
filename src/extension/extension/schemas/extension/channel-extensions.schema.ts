import Joi from "joi";

export const ChannelExtensionsSchema = Joi.object({
    channel: Joi.string().required(),
})