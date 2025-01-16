import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class UpdateKLoukdoPromotionInput {
    @Field()
    @IsNotEmpty()
    id: string;

    @Field({nullable: true})
    product: string;

    @Field({nullable: true})
    endDate: Date
}