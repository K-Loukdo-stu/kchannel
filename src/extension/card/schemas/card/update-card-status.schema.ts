import * as Joi from "joi";

export const UpdateCardStatusSchema = Joi.object({
    id: Joi.string().required(),
    deleted: Joi.boolean().required(),
})