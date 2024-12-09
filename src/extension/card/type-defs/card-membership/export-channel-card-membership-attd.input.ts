import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class ExportChannelCardMembershipWithAttInput {
    @Field()
    @IsNotEmpty()
    card: string;

    @Field()
    @IsNotEmpty()
    channel: string;
}