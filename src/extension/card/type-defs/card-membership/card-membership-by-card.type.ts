import { Field, ObjectType } from "@nestjs/graphql";
import { CardMembershipType } from "./card-membership.type";


@ObjectType()
export class CardMembershipByCardType {
    @Field()
    total: number;

    @Field(()=> [CardMembershipType])
    cardMembership: CardMembershipType;
}