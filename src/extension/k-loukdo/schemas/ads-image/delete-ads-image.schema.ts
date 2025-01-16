import Joi from "joi";

export const DeleteKLoukdoAdvertisementImageSchema = Joi.object({
    id: Joi.string().required()
})