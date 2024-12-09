import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class CreateCardMembershipInput {
    @Field()
    @IsNotEmpty()
    expiredAt: string;

    @Field()
    @IsNotEmpty()
    issuedAt: string;

    @Field({ nullable: true })
    @IsNotEmpty()
    card: string;

    @Field(type => [String])
    @IsNotEmpty()
    users: string[];

    @Field()
    @IsNotEmpty()
    approved: boolean;
}