import Joi from "joi";

export const DeleteOrderLineSchema = Joi.object({
    id: Joi.string().required()
})