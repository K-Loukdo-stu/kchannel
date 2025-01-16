import { Field, ObjectType } from "@nestjs/graphql";
import { KLoukdoCategoryType } from "../category/category.type";
import { ProductType } from "src/extension/product/type-defs";
import { KLoukdoSubCategoryType } from "../sub-category/sub-category.type";

@ObjectType()
export class KLoukdoCategorizedProductType {
    @Field()
    id: string;

    @Field()
    product: ProductType;

    @Field()
    category: KLoukdoCategoryType;

    @Field()
    subCategory: KLoukdoSubCategoryType;
}