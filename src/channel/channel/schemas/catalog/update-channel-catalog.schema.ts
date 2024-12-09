import * as Joi from 'joi';

export const UpdateChannelCatalogSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().optional().allow(''),
    productType: Joi.string().optional().allow('')
})