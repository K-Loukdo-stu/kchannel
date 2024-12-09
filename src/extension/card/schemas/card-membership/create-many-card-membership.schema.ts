import Joi from "joi";

export const CreateCardManyMembershipSchema = Joi.object({
    expiredAt: Joi.string().required(),
    issuedAt: Joi.string().required(),
    user: Joi.array().items(Joi.string()).required(),
    card: Joi.string().required(),
    approved: Joi.boolean().required(),
})