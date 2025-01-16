import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class CreateKLoukdoCategorizedProductInput {

    @Field()
    @IsNotEmpty()
    product: string;

    @Field()
    @IsNotEmpty()
    category: string;

    @Field()
    @IsNotEmpty()
    subCategory: string;

}