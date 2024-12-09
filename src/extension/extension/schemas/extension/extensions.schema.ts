import Joi from "joi";

export const ExtensionsSchema = Joi.object({
    channel: Joi.string().required(),
})