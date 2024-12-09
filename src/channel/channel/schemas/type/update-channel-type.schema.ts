import Joi from "joi";

export const UpdateChannelTypeSchema = Joi.object({
    id: Joi.string().required(),
    productType: Joi.string().optional().allow(''),
    channel: Joi.string().optional().allow('')
})