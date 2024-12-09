import * as Joi from "joi";

export const CreateUpdateChannelFollowshipSchema = Joi.object({
    id: Joi.string().required(),
    channel: Joi.string().optional().allow(null),
    user: Joi.string().optional().allow(null),
    joinAt: Joi.number().required(),
    addedBy: Joi.string().optional().allow(null),
    deleted: Joi.boolean().required(),
    createdAt: Joi.number().required(),
    updatedAt: Joi.number().required(),
})