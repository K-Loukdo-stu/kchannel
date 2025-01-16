import Joi from "joi"

export const GetKLoukdoPromotionByCategorySchema = Joi.object({
    category: Joi.string().required()
})