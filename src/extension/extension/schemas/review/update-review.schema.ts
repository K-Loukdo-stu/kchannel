import Joi from "joi";

export const UpdateReviewSchema = Joi.object({
    id: Joi.string().required(),
    feedback: Joi.string().required(),
    rate: Joi.number().required(),
})