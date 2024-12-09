import Joi from "joi";

export const SysDefinedProductTypesSchema = Joi.object({
    catalog: Joi.string().required(),
})