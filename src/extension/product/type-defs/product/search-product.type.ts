
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductType } from "./product.type";

@ObjectType()
export default class SearchProductType {

    @Field(() => [ProductType])
    products: ProductType;

    @Field({ nullable: true })
    productTotal: number;

    @Field({ nullable: true })
    pageTotal: number;

}