import Joi from "joi";


export const UpdateCardMembershipSchema = Joi.object({
    id: Joi.string().required(),
    expiredAt: Joi.string().required(),
    issuedAt: Joi.string().required(),
    user: Joi.string().required(),
    card: Joi.string().required(),
    approved: Joi.boolean().required(),
})