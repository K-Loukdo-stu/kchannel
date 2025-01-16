import Joi from "joi"

export const UpdateKLoukdoPromotionSchema = Joi.object({
    id: Joi.string().required(),
    product: Joi.string().optional(),
    endDate: Joi.date().optional()
})