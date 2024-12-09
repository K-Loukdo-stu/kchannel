import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"
import { ProductTypeType } from "../product-type";
import { PriceType } from "../price";
import { ChannelType } from "src/channel/channel/type-defs/channel";

@ObjectType()
export class ProductType {
    @Field()
    page: number;

    @Field()
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true, defaultValue: false })
    showOnMenuBoard: boolean;

    @Field({ nullable: true })
    price: PriceType;

    @Field({ nullable: true })
    productType: ProductTypeType;

    @Field({ nullable: true })
    channel: ChannelType;

    @Field(() => JSON, { nullable: true })
    photo?: any;

    @Field()
    createdAt: number;

    @Field()
    updatedAt: number;
}