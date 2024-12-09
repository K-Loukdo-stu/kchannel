import Joi from "joi";

export const DeleteProductTypeSchema = Joi.object({
    id: Joi.string().required()
})