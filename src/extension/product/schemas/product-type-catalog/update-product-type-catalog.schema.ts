import * as Joi from "joi";

export const UpdateProductTypeCatalogSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().optional().allow(''),
    icon: Joi.object().optional()
})