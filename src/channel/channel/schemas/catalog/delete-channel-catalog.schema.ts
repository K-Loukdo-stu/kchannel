import * as Joi from 'joi';

export const DeleteChannelCatalogSchema = Joi.object({
    id: Joi.string().required()
})