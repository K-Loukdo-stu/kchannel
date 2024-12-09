import Joi from "joi";


export const UpdateProductPriceSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.pattern.base': 'Name must contain only alphanumeric characters.'
        }).required(),
    price: Joi.number().required(),
    discountPrice: Joi.number().optional(),
    hasDiscount: Joi.boolean().optional(),
    currency: Joi.string().optional(),
})