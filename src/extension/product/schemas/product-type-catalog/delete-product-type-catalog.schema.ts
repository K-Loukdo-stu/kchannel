import Joi from "joi";

export const DeleteProductTypeCatalogSchema = Joi.object({
    id: Joi.string().required()
})