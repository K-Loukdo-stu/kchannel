import Joi from "joi";

export const UpdateManyCardMembershipSchema = Joi.object({
    users: Joi.array().items(Joi.string()).required(),
    card: Joi.string().required(),
})