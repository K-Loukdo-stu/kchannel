import * as Joi from 'joi';

export const ChannelCatalogsByChannelKindSchema = Joi.object({
    channelKind: Joi.string().required(),
})