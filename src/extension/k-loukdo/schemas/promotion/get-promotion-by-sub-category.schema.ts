import Joi from "joi";

export const GetKLoukdoPromotionBySubCategorySchema = Joi.object({
    subCategory: Joi.string().required()
})