import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class ExportCardMembershipWithAttInput {
    @Field()
    @IsNotEmpty()
    card: string;

    @Field()
    @IsNotEmpty()
    attSess: string;
}