import Joi from "joi";


export const ExtensionSchema = Joi.object({
    id: Joi.string().required(),
})