import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class GetKLoukdoPromotionByCategoryInput {
    @Field()
    @IsNotEmpty()
    category: string;
}