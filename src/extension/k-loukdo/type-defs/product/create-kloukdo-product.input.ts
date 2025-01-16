import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsArray } from "class-validator";
import JSON from "graphql-type-json"
@InputType()
export default class CreateKLoukdoProductInput {
    @Field({ nullable: true })
    id?: string;

    @Field()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    price: number;

    @Field()
    @IsNotEmpty()
    category: string;

    @Field()
    @IsNotEmpty()
    subCategory: string;

    // @Field({ nullable: true })
    // user: string;

    @Field(() => [JSON], { nullable: true })
    @IsOptional()
    @IsArray()
    photos?: any[];

    @Field()
    @IsOptional()
    discountPrice: number;

    @Field()
    hasDiscount: boolean;

    @Field()
    currency: string;
}