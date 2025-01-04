import Joi from "joi";

export const CreateKLoukdoSubCategorySchema = Joi.object({
    // id: Joi.string().required(),
    name: Joi.string().required(),
    category: Joi.string().required()
    // icon: Joi.string().required
})