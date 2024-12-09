import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"
import { ProductTypeCatalogType } from "../product-type-catalog";

@ObjectType()
export class ProductTypeType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => JSON, { nullable: true })
    icon?: any;

    @Field({ nullable: true })
    channel?: string;

    @Field({ nullable: true })
    channelType?: string;

    @Field({ nullable: true })
    productTotal?: number;

    @Field(() => JSON, { nullable: true })
    photoProductType?: any;
}