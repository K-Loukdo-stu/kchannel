import Joi from "joi";

export const DeleteReviewSchema = Joi.object({
    id: Joi.string().required()
})