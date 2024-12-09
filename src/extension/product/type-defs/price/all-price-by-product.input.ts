import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class AllpricesByProductInput {
    @Field()
    @IsNotEmpty()
    product: string;
}