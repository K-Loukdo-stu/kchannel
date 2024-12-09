import Joi from "joi";

export const AllProductsByChannelSchema = Joi.object({
    channel: Joi.string().required(),
})