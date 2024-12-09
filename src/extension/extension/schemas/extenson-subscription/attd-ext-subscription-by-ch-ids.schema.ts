import Joi from "joi";


export const AttdExtSubscriptionByChannelIdsSchema = Joi.object({
    pageNumber: Joi.number().optional(),
    limit: Joi.number().optional(),
})