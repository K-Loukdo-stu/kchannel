import Joi from "joi";

export const ChFollowerRemarkFieldsSchema = Joi.object({
   follower: Joi.string().required(),
   channel: Joi.string().required(),
})