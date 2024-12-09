import Joi from "joi";


export const UpdateExtensionSubscriptionSchema = Joi.object({
    id: Joi.string().required(),
    extension: Joi.string().required(),
    expiredAt: Joi.number().required(),
    issuedAt: Joi.number().required(),
    channel: Joi.string().required(),
    deleted: Joi.boolean().required(),
})