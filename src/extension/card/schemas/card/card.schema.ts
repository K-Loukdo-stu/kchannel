import Joi from "joi";

export const CardSchema = Joi.object({
    id: Joi.string().required()
})