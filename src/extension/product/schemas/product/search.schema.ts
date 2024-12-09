import Joi from "joi";

export const SearchProductNameSchema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
});