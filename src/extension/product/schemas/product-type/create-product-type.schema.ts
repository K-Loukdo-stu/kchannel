import Joi from "joi";

export const CreateProductTypeSchema = Joi.object({
    id: Joi.string().optional().allow(''),
    name: Joi.string().required(),
    channel: Joi.string().optional(),
    catalog: Joi.string().optional(),
    icon: Joi.object().optional()
})