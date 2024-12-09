import Joi, * as joi from 'joi';


export const FindProductIdSchema = joi.object({
    id: Joi.string().required(),
})