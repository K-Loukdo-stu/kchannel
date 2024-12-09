import Joi from "joi";

export const DeleteOptionSchema = Joi.object({
    id: Joi.string().required()
})