import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class CreateExtensionInput {

    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsNotEmpty()
    keyname: string;

    @Field()
    @IsNotEmpty()
    desc: string;

}