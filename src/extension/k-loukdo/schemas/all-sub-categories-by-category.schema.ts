import Joi from "joi";

export const AllKLoukdoSubCategoryByKLoukdoCategorySchema = Joi.object({
    category: Joi.string().required
})