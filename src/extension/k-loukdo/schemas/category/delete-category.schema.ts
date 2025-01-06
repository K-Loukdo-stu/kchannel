import Joi from "joi";

export const DeleteKLoukdoCategorySchema = Joi.object({
    id: Joi.string().required(),
})