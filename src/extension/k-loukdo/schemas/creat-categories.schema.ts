import Joi from "joi";

export const CreateKLoukdoCategorySchema = Joi.object({
    // id: Joi.string().required(),
    name: Joi.string().required(),
    // icon: Joi.string().required
})