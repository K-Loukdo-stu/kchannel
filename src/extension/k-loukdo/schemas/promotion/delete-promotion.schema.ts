import Joi from "joi"

export const DeleteKLoukdoPromotionSchema = Joi.object({
    id: Joi.string().required()
})