import * as Joi from 'joi';

export const CreateChannelCatalogSchema = Joi.object({
    name: Joi.string().required(),
    channelKind: Joi.string().required(),
})