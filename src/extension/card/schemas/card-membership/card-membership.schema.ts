import Joi from "joi";

export const CardMembershipSchema = Joi.object({
    // id: Joi.string().required(),
    card: Joi.string().required(),
    attSess: Joi.string().required(),
    page: Joi.number().required(),
    filter: Joi.string().optional().allow(""),
    status: Joi.string().optional().allow(""),
})