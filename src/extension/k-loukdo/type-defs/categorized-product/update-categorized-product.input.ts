import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class UpdateKLoukdoCategorizedProductInput {
    @Field()
    @IsNotEmpty()
    id: string;

    @Field({nullable: true})
    product: string;

    @Field({nullable: true})
    category: string;

    @Field({nullable: true})
    subCategory: string;
}