import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import JSON from "graphql-type-json"
import { KLoukdoCategoryType } from "../category/category.type";

@InputType()
export default class UpdateKLoukdoSubCategoryInput {
    @Field()
    @IsNotEmpty()
    id: string;

    @Field({nullable: true})
    name: string;

    @Field({nullable: true})
    icon: string;

    @Field({nullable: true})
    category: string;
}