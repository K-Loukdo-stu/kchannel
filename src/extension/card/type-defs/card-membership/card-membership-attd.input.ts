import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class CardMembershipWithAttInput {
    @Field()
    @IsNotEmpty()
    card: string;

    @Field()
    @IsNotEmpty()
    attSess: string;

    @Field()
    @IsNotEmpty()
    page: number;

    @Field({ nullable: true })
    filter: string;

    @Field({ nullable: true })
    status: string;
}