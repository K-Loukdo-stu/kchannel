import Joi from "joi";

export const GetKLoukdoSubCategoryByKLoukdoCategorySchema = Joi.object({
    category: Joi.string().required()
})