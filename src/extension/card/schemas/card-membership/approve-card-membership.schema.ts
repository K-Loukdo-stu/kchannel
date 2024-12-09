import Joi from "joi";

export const ApproveCardMembershipSchema = Joi.object({
    user: Joi.string().required(),
    card: Joi.string().required(),
})