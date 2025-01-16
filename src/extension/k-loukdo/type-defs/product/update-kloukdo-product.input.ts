import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsOptional } from "class-validator";
import JSON from "graphql-type-json"

@InputType()
export default class UpdateKLoukdoProductInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    price: number;

    @Field({ nullable: true })
    category: string;

    @Field({ nullable: true })
    subCategory: string;

    @Field(() => [JSON], { nullable: true })
    @IsOptional()
    @IsArray()
    photos?: any[];
}