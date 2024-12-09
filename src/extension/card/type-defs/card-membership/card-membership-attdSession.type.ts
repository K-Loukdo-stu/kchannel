import { Field, ObjectType } from "@nestjs/graphql";
import { ChannelRemarkType } from "src/channel/channel/type-defs/channel-remark/channel-remark.type";
import { UnpopulatedFollowerRemarkFieldType } from "src/channel/channel/type-defs/follower-remark-field/follower-remark-field.type";
import { UserType } from "src/user/typeDefs/user.type";
import { CardType } from "../card/card.type";


@ObjectType()
export class CardMembershipAttdSessionType {
    @Field()
    page: number;

    @Field()
    filter: string;

    @Field()
    status: string;

    @Field()
    sortBy: boolean;

    @Field()
    id: string;

    @Field()
    expiredAt: string;

    @Field()
    issuedAt: string;

    @Field({ nullable: true })
    card: CardType;

    @Field()
    user: UserType;

    @Field(() => [ChannelRemarkType], { nullable: true })
    channelRemarks: any;

    @Field({ nullable: true })
    followerRemarkField: UnpopulatedFollowerRemarkFieldType;

    @Field({ nullable: true })
    createdAt?: Date;

    @Field({ nullable: true })
    updatedAt?: Date;

    @Field({ nullable: true })
    approved: boolean;

    // @Field({ nullable: true })
    // attdSession: UnpopulatedAttdSessionType;
}