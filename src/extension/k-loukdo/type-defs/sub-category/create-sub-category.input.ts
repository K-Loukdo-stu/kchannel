import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import JSON from "graphql-type-json"

@InputType()
export default class CreateKLoukdoSubCategoryInput {

    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsNotEmpty()
    category: string;

    @Field({nullable: true})
    icon: string;
}