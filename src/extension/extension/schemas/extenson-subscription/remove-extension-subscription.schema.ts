import Joi from "joi";


export const RemoveExtensionSubscriptionSchema = Joi.object({
    id: Joi.string().required(),
    deleted: Joi.boolean().required(),
})