import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class CreateKLoukdoPromotionInput {
    @Field()
    @IsNotEmpty()
    product: string;

    @Field()
    @IsNotEmpty()
    endDate: Date;
}