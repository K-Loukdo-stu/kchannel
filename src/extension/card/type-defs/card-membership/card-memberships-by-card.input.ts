import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CardMembershipsByCardInput {
    @Field()
    card: string;

    @Field()
    @IsNotEmpty()
    page: number;

    @Field({ nullable: true })
    filter: string;

    @Field({ nullable: true })
    sortBy: string;
}