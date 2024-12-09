import Joi from "joi";

export const CreateManyChannelTypesSchema = Joi.object({
    productTypes: Joi.array().items(Joi.string()).required(),
    channel: Joi.string().required()
})