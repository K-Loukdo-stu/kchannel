import Joi from "joi";

export const UpdateOrderLineQtySchema = Joi.object({
    id: Joi.string().required(),
    quantity: Joi.number().min(0).required()
})