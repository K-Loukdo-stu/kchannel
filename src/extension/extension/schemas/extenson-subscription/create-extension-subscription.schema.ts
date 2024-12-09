import Joi from "joi";

export const CreateExtensionSubscriptionSchema = Joi.object({
    extension: Joi.string().required(),
    expiredAt: Joi.number().required(),
    issuedAt: Joi.number().required(),
    channel: Joi.string().required(),
    deleted: Joi.boolean().required(),
})