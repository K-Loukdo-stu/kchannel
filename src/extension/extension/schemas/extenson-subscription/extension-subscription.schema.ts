import Joi from "joi";


export const ExtensionSubscriptionSchema = Joi.object({
    id: Joi.string().required(),
})