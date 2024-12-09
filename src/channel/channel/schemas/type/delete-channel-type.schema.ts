import Joi from "joi";

export const DeleteChannelTypeSchema = Joi.object({
    id: Joi.string().required()
})