import Joi from "joi";

export const ExportChannelCardMembershipSchema = Joi.object({
    card: Joi.string().required(),
    channel: Joi.string().required(),
})