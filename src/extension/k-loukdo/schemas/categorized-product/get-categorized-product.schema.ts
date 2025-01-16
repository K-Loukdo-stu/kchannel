import Joi from "joi";

export const GetKLoukdoCategorizedProductSchema = Joi.object({
    id: Joi.string().required()
})