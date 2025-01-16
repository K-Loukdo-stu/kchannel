import Joi from "joi";

export const UpdateKLoukdoCategorizedProductSchema = Joi.object({
    id: Joi.string().required(),
    product: Joi.string().optional(),
    category: Joi.string().optional(),
    subCategory: Joi.string().optional(),
    
})