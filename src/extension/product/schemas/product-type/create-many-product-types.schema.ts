import Joi from "joi";

export const CreateManyProductTypesSchema = Joi.object({
    names: Joi.array().items(Joi.string()).required(),
    channel: Joi.string().required(),
})