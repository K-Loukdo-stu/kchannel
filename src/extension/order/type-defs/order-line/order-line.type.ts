import { Field, ObjectType } from "@nestjs/graphql";
import { OrderType } from "../order/order.type";
import JSON from "graphql-type-json"

@ObjectType()
export class OrderLineType {
    @Field()
    id: string;

    @Field()
    order: OrderType;

    @Field()
    product: string;

    @Field(() => JSON)
    clonedProduct: any;

    @Field(() => JSON, { nullable: true })
    clonedBasePrice: any;

    @Field(() => [JSON], { nullable: true })
    clonedOptions: any;

    @Field()
    price: number;

    @Field()
    currency: string;

    @Field()
    qty: number;

    @Field({ nullable: true })
    shortDesc: string;
}