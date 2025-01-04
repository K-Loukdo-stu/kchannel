import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

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