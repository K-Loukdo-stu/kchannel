import JSON from "graphql-type-json";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class CreateOrderLineInput {
    @Field()
    order: string;

    @Field()
    product: string;

    @Field(() => JSON)
    clonedProduct: any;

    @Field(() => JSON)
    clonedBasePrice: any;

    @Field(() => [JSON])
    clonedOptions: any;

    @Field()
    price: number;

    @Field()
    currency: string;

    @Field()
    qty: number;
}