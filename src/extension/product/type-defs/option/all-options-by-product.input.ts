import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class AllOptionsByProductInput {
    @Field()
    @IsNotEmpty()
    product: string;
}