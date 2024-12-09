import Joi from "joi";

export const CreateReviewChannelSchema = Joi.object({
    feedback: Joi.string().optional().allow(''),
    rate: Joi.number().required(),
    channel: Joi.string().required()
})