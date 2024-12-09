import Joi from "joi";


export const DeleteSubOptionSchema = Joi.object({
    id: Joi.string().required()
})