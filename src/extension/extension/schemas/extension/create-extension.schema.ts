import Joi from "joi";

export const CreateExtensionSchema = Joi.object({
    name: Joi.string().required(),
    keyname: Joi.string().required(),
    desc: Joi.string().required(),
})