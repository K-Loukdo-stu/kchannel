import { Field, InputType } from "@nestjs/graphql";
import { OrderLineByChannelInput } from "./order-line-by-channel-input.input";


@InputType()
export class CreateOrderLineByChannelInput {
    @Field()
    channel: string;

    @Field()
    orderLine: OrderLineByChannelInput;
}