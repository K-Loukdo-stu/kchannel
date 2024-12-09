import * as Joi from "joi";

export const CreateUpdateSynUserSchema = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().optional().allow('', null),
    email: Joi.string().optional().allow('', null),
    bio: Joi.string().optional().allow('', null),
    photo: Joi.object().optional().allow('', null),
    cover: Joi.object().optional().allow('', null),
    role: Joi.number().required(),
    createdAt: Joi.number().required(),
    updatedAt: Joi.number().required(),
    activated: Joi.boolean().optional().allow('', null),
})