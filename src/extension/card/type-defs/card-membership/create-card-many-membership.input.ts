import { Field, InputType } from "@nestjs/graphql";
import { CardMembershipType } from "./card-membership.type";


@InputType()
export default class CreateCardManyMembershipInput {
    @Field(()=> [CardMembershipType])
    cardMembership: CardMembershipType;
}