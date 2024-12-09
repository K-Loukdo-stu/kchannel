import Joi from "joi";

export const ProductTypesSchema = Joi.object({
    channel: Joi.string().optional().allow(""),
})