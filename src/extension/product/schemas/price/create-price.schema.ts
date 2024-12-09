import { Currency } from "@htkradass/common";
import Joi from "joi";

export const CreatePriceSchema = Joi.object({
    id: Joi.string().optional().allow(''),
    name: Joi.string()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.pattern.base': 'Name must contain only alphanumeric characters.'
        }).required(),
    price: Joi.number().required(),
    discountPrice: Joi.number().required(),
    hasDiscount: Joi.boolean().optional().default(false),
    isMain: Joi.boolean().optional().default(false),
    currency: Joi.string().valid(Currency.KHR.code, Currency.USD.code).required(),
    product: Joi.string().required()
})