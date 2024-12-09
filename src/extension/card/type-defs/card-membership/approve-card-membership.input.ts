import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class ApproveCardMembershipInput {
    @Field()
    @IsNotEmpty()
    card: string;

    @Field()
    @IsNotEmpty()
    user: string;
}