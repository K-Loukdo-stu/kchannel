
import { Field, ObjectType } from "@nestjs/graphql";
import { ProductTypeCatalogType } from "./product-type-catalog.type";

@ObjectType()
export default class SearchProductTypeCatalogType {

    @Field(() => [ProductTypeCatalogType])
    productTypeCatalogs: ProductTypeCatalogType;

    @Field({nullable:true})
    productTypeCatalogsCount: number;

}