import Joi from "joi";

export const AllOptionsByProductSchema = Joi.object({
    product: Joi.string().required(),
})