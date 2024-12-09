import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import JSON from "graphql-type-json"

@InputType()
export default class CreateProductTypeInput {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field(() => JSON, {nullable: true})
    image: any;
}