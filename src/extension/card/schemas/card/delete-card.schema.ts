import Joi from "joi";

export const DeleteCardSchema = Joi.object({
    id: Joi.string().required()
})