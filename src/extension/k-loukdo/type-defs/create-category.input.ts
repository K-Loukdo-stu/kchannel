import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class CreateKLoukdoCategoryInput {


    @Field()
    @IsNotEmpty()
    name: string;

    @Field({nullable: true})
    icon: string;
}