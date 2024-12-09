import { Field, InputType } from "@nestjs/graphql";


@InputType()
export default class DeleteCardMembershipInput {
    @Field()
    id: string;
}