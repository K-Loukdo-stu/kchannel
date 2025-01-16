import Joi from "joi";

export const UpdateKLoukdoSubCategorySchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().optional(),
    icon: Joi.string().optional(),
    category: Joi.string().optional(),

})