import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"
import { KLoukdoCategoryType } from "../category/category.type";

@ObjectType()
export class KLoukdoSubCategoryType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    category: KLoukdoCategoryType;

    @Field({nullable: true})
    icon: string;
}