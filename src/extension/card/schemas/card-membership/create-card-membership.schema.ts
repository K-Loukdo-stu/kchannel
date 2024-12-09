import Joi from "joi";

export const CreateCardMembershipSchema = Joi.object({
    expiredAt: Joi.string().required(),
    issuedAt: Joi.string().required(),
    users: Joi.array().items(Joi.string()).required(),
    card: Joi.string().required(),
    approved: Joi.boolean().required(),
})