import Joi from "joi";

export const CardMembershipsByCardSchema = Joi.object({
    card: Joi.string().required(),
    page: Joi.number().required(),
    filter: Joi.string().optional().allow(""),
    sortBy: Joi.string().optional().allow(""),
})