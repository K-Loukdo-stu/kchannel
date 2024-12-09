import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class DeleteManyCardMembershipInput {
    @Field()
    @IsNotEmpty()
    card: string;

    @Field(() => [String])
    @IsNotEmpty()
    users: string[];
}