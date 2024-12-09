import Joi from "joi";


export const UpdateOptionSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.pattern.base': 'Name must contain only alphanumeric characters.'
        }).required(),
    type: Joi.string().required(),
})