import { Field, ObjectType } from "@nestjs/graphql";
import { CardMembershipType } from "./card-membership.type";


@ObjectType()
export class CardManyMembershipType {

    @Field(()=> [CardMembershipType])
    cardManyMembership: CardMembershipType;
}