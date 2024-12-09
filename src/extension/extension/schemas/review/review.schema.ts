import Joi from "joi";

export const ReviewSchema = Joi.object({
    id: Joi.string().required(),
})