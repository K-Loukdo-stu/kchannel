import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class CreatePriceInput {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    price: number;

    @Field()
    @IsNotEmpty()
    discountPrice: number;

    @Field()
    @IsNotEmpty()
    hasDiscount: boolean;

    @Field({ nullable: true, defaultValue: false })
    isMain: boolean;

    @Field()
    @IsNotEmpty()
    currency: string;

    @Field()
    @IsNotEmpty()
    product: string;
}