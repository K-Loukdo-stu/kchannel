import Joi from "joi";

export const DeleteChannelRemarkSchema = Joi.object({
   id: Joi.string().required()
})