import Joi from "joi";

export const CreateKLoukdoCategorySchema = Joi.object({
    name: Joi.string().required(),
    icon: Joi.string().optional(),
})