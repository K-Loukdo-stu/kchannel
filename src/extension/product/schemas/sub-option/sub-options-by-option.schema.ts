import Joi from "joi";


export const SubOptionsByOptionSchema = Joi.object({
    option: Joi.string().required(),
})