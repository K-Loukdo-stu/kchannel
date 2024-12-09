import Joi from "joi";


export const DeleteExtensionSubscriptionSchema = Joi.object({
    id: Joi.string().required()
})