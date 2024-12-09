import * as Joi from "joi";

export const CreateUpdateSynChannelSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    kind: Joi.string().required(),
    catalog: Joi.string().optional().allow('', null),
    bio: Joi.string().optional().allow('', null),
    desc: Joi.string().optional().allow('', null),
    phone: Joi.string().optional().allow('', null),
    email: Joi.string().optional().allow('', null),
    website: Joi.string().optional().allow('', null),
    productTypes: Joi.array().items(Joi.string()).optional(),
    profile: Joi.object().optional().allow('', null),
    cover: Joi.object().optional().allow('', null),
    createdAt: Joi.number().required(),
    updatedAt: Joi.number().required(),
    createdBy: Joi.string().optional().allow('', null),
    deleted: Joi.boolean().optional().allow('', null),
})