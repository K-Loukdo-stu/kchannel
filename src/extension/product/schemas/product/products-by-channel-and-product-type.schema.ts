import * as Joi from "joi";


export const ProductsByChannelAndProductTypeSchema = Joi.object({
    pageNumber: Joi.number().optional(),
    limit: Joi.number().optional(),
    productType: Joi.string().optional().allow(""),
    channel: Joi.string().required()
})