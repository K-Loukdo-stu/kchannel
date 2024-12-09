import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class CreateSubOptionInput {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsNotEmpty()
    price: number;

    @Field()
    @IsNotEmpty()
    option: string;

    @Field()
    @IsNotEmpty()
    currency: string;

    @Field()
    @IsNotEmpty()
    product: string;
}