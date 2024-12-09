import * as Joi from 'joi';

export const SearchChannelsSchema = Joi.object({
  searchText: Joi.string().required().allow(""),
  currentPage: Joi.number().required(),
  limit: Joi.number().required(),
})
