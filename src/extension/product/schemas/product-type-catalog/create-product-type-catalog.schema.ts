import Joi from "joi";

export const CreateProductTypeCatalogSchema = Joi.object({
    id: Joi.string().optional().allow(''),
    name: Joi.string().required(),
    icon: Joi.object().optional()
})