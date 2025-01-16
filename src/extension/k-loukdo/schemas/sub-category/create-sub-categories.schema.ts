import Joi from "joi";

export const CreateKLoukdoSubCategorySchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    icon: Joi.string().optional()
})