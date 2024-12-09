import Joi from "joi";

export const CreateChannelTypeSchema = Joi.object({
    id: Joi.string().optional().allow(''),
    productType: Joi.string().required(),
    channel: Joi.string().required()
})