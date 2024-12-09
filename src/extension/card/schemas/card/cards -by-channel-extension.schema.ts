import Joi from "joi";

export const CardsByChannelAndExtensionSchema = Joi.object({
    channelId: Joi.string().required(),
    extensionKeyname: Joi.string().required(),
})