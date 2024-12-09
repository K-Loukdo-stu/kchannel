import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateManyCardMembershipsInput {
    @Field()
    card: string;

    @Field(() => [String])
    users: string[];
}