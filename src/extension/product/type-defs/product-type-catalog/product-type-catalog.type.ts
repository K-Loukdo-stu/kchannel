import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"
import { ProductTypeType } from "../product-type/product-type.type";

@ObjectType()
export class ProductTypeCatalogType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => JSON, { nullable: true })
    icon?: string;

    @Field(() => [ProductTypeType], { nullable: true })
    productTypes?: any;
}