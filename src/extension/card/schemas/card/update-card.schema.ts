import * as Joi from "joi";

export const UpdateCardSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    channel: Joi.string().required(),
    extensionKeyname: Joi.string().required(),
    autoApproved: Joi.boolean().required(),
    deleted: Joi.boolean().required(),
    desc: Joi.string().required(),
})