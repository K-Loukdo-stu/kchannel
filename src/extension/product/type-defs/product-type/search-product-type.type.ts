
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductTypeType } from "./product-type.type";

@ObjectType()
export default class SearchProductTypeType {

    @Field(() => [ProductTypeType])
    productTypes: ProductTypeType;

    @Field({nullable:true})
    productTypesCount: number;

}