import Joi from "joi";

export const ExportCardMembershipSchema = Joi.object({
    card: Joi.string().required(),
    attSess: Joi.string().required(),
})