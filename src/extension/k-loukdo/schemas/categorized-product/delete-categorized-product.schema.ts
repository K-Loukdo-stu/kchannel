import Joi from "joi";

export const DeleteKLoukdoCategorizedProductSchema = Joi.object({
    id: Joi.string().required()
})