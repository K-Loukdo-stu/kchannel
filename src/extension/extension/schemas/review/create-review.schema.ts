import Joi from "joi";

export const CreateReviewSchema = Joi.object({
    feedback: Joi.string().required(),
    rate: Joi.number().required(),
    extension: Joi.string().required()
})