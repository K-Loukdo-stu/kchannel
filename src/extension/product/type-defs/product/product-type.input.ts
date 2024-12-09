import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class ProductTypeInput {
    @Field()
    @IsNotEmpty()
    page: number;

    @Field({nullable: true, defaultValue: 15})
    limit: number;

    @Field()
    @IsNotEmpty()
    productTypeId: string;
}