import Joi from "joi";


export const UpdateExtensionSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    keyname: Joi.string().optional(),
    desc: Joi.string().optional(),
})