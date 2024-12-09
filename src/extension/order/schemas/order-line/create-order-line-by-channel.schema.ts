import Joi from "joi";
import { OrderLineByChannelSchema } from "./create-order-line.schema";

export const CreateOrderLineByChannelSchema = Joi.object({
    channel: Joi.string().required(),
    orderLine: OrderLineByChannelSchema.required(),
});