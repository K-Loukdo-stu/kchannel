import * as Joi from "joi";

export const UpdateProductTypeSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().optional().allow(''),
    catalog: Joi.string().optional().allow(''),
    icon: Joi.object().optional()
})