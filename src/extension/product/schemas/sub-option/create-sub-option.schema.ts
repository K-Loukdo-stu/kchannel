import { Currency } from "@htkradass/common";
import Joi from "joi";

export const CreateSubOptionSchema = Joi.object({
    id: Joi.string().optional().allow(''),
    name: Joi.string()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.pattern.base': 'Name must contain only alphanumeric characters.'
        }).required(),
    price: Joi.number().required(),
    option: Joi.string().required(),
    currency: Joi.string().valid(Currency.KHR.code, Currency.USD.code).required(),
    product: Joi.string().required()
})
