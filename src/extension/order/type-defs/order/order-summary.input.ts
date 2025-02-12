import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class OrderSummaryInput {
    @Field()
    orderId: string;
}