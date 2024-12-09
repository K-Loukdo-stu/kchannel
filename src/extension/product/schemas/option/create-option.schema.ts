import Joi from "joi";

export const CreateOptionSchema = Joi.object({
    name: Joi.string()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.pattern.base': 'Name must contain only alphanumeric characters.'
        }).required(),
    type: Joi.string().required(),
    product: Joi.string().required()
})