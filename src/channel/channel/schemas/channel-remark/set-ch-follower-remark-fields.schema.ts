import Joi from "joi";

const ChFollowerRemarkFieldSchema = Joi.object({
   remark: Joi.string().required(),
   value: Joi.string().required().allow(""),
})

export const SetChFollowerRemarkFieldsSchema = Joi.object({
   follower: Joi.string().required(),
   channel: Joi.string().required(),
   remarkFields: Joi.array().items(ChFollowerRemarkFieldSchema).required(),
})