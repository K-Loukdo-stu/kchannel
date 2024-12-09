import Joi from "joi";

export const SetExtensionOnMenuBoardSchema = Joi.object({
    channel: Joi.string().required(),
    extension: Joi.string().required(),
    isOnMenuBoard: Joi.bool().required(),
})