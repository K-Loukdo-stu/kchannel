import Joi from "joi";

const OrderLineClonedProductSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    productType: Joi.object().required(),
    photo: Joi.object().required(),
});

const OrderLineClonedBasePriceSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    discountPrice: Joi.number().required(),
    hasDiscount: Joi.boolean().required(),
    isMain: Joi.boolean().required(),
    currency: Joi.string().required(),
});

const OrderLineClonedOptionsSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    product: Joi.string().required(),
    choice: Joi.object().optional(),
    choices: Joi.array().items(Joi.object()).optional(),
}).or('choice', 'choices');

export const CreateOrderLineSchema = Joi.object({
    product: Joi.string().required(),
    clonedProduct: OrderLineClonedProductSchema.unknown(),
    clonedBasePrice: OrderLineClonedBasePriceSchema.unknown(),
    clonedOptions: Joi.array().items(OrderLineClonedOptionsSchema.unknown()).required(),
    qty: Joi.number().required(),
    price: Joi.number().required(),
    currency: Joi.string().required(),
    order: Joi.string().required()
});

export const OrderLineByChannelSchema = Joi.object({
    product: Joi.string().required(),
    clonedProduct: OrderLineClonedProductSchema.unknown(),
    clonedBasePrice: OrderLineClonedBasePriceSchema.unknown(),
    clonedOptions: Joi.array().items(OrderLineClonedOptionsSchema.unknown()).optional().allow(null),
    qty: Joi.number().required(),
    price: Joi.number().required(),
    currency: Joi.string().required(),
});