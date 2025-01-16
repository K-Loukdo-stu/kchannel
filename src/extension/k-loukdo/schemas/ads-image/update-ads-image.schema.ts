import Joi from "joi";

export const UpdateKLoukdoAdvertisementImageSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().optional(),
    image: Joi.object().optional(),
    endDate: Joi.date().optional()
})