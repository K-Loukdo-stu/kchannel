import Joi from "joi";

export const DeletePriceSchema = Joi.object({
    id: Joi.string().required()
})