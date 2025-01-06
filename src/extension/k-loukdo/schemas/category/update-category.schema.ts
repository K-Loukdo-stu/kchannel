import Joi from "joi";

export const UpdateKLoukdoCategorySchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().optional(),
    icon: Joi.object().optional()
})