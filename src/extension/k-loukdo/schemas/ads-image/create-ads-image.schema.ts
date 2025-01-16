import Joi from "joi";

export const CreateKLoukdoAdsImageSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.object().optional(),
    endDate: Joi.date().required()
})