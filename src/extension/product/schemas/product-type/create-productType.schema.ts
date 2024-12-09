import Joi from "joi";

export const CreateProductTypeSchema = Joi.object({
    id: Joi.string().optional().allow(''),
    name: Joi.string().required(),
    image: Joi.object().optional()
})