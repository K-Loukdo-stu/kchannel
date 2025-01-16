import Joi from "joi";

export const DeleteKLoukdoSubCategorySchema = Joi.object({
    id: Joi.string().required()
})