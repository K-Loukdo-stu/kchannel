import Joi from "joi";

export const AllPricesByProductSchema = Joi.object({
    product: Joi.string().required(),
})