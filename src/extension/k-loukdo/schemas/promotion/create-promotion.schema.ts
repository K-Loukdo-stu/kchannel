import Joi from "joi";

export const CreateKLoukdoPromotionSchema = Joi.object({
    product: Joi.string().required(),
    endDate: Joi.date().required()
})