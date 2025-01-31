import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"
import { KLoukdoSubCategoryType } from "./sub-category.type";

@ObjectType()
export class GetKLoukdoSubCategoryByPageType {
    @Field(() => [KLoukdoSubCategoryType])
    subCategory: KLoukdoSubCategoryType;

    @Field({ nullable: true })
    total: number;

    @Field({ nullable: true })
    page: number;
}