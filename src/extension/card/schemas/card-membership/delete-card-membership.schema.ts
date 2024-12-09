import Joi from "joi";


export const DeleteCardMembershipSchema = Joi.object({
    id: Joi.string().required()
})