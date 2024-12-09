import { Field, InputType } from "@nestjs/graphql";
import JSON from "graphql-type-json";

@InputType()
export class OrderLineByChannelInput {
    @Field()
    product: string;

    @Field(() => JSON)
    clonedProduct: any;

    @Field(() => JSON)
    clonedBasePrice: any;

    @Field(() => [JSON], { nullable: true })
    clonedOptions: any;

    @Field()
    price: number;

    @Field()
    currency: string;

    @Field()
    qty: number;
}
