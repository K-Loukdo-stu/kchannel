import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";

@InputType()
export default class ProductsByChannelAndProductTypeInput {
    @Field({ nullable: true, defaultValue: "" })
    productType: string;

    @Field()
    @IsNotEmpty()
    channel: string;

    @Field({ nullable: true, defaultValue: 1 })
    pageNumber: number;

    @Field({ nullable: true, defaultValue: 15 })
    limit: number;
}