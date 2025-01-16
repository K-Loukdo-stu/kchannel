import Joi from "joi";

export const CreateKLoukdoCategorizedProductSchema = Joi.object({
    product: Joi.string().required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required()
})