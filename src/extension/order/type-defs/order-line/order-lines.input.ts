import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class OrderLinesInput {
    @Field()
    orderId: string;
}