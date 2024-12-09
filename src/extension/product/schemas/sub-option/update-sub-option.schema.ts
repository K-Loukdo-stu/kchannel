import { Currency } from "@htkradass/common";
import Joi from "joi";


export const UpdateSubOptionSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string()
        .regex(/^[a-zA-Z0-9]+$/)
        .messages({
            'string.pattern.base': 'Name must contain only alphanumeric characters.'
        }).required(),
    price: Joi.number().required(),
    currency: Joi.string().valid(Currency.KHR.code, Currency.USD.code).required(),
})