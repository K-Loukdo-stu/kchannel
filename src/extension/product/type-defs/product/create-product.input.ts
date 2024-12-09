import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import JSON from "graphql-type-json"
@InputType()
export default class CreateProductInput {
    @Field({ nullable: true })
    id?: string;

    @Field()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    price: number;

    @Field()
    @IsNotEmpty()
    productType: string;

    @Field()
    @IsNotEmpty()
    channel: string;

    @Field(() => JSON, { nullable: true })
    photo: any;

    @Field()
    discountPrice: number;

    @Field()
    hasDiscount: boolean;

    @Field()
    currency: string;
}