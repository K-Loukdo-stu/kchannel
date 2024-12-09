import Joi from "joi";


export const DeleteExtensionSchema = Joi.object({
    id: Joi.string().required()
})