import Joi from "joi";

export const CreateCardSchema = Joi.object({
    name: Joi.string().required(),
    channel: Joi.string().required(),
    extensionKeyname: Joi.string().required(),
    autoApproved: Joi.boolean().required(),
    deleted: Joi.boolean().required(),
    desc: Joi.string().optional().allow(""),
})