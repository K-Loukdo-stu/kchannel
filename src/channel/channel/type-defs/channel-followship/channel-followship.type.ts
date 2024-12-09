import { Field, ObjectType } from "@nestjs/graphql";
import { UserType } from "src/user/typeDefs/user.type";
import { ChannelType } from "../channel/channel.type";

@ObjectType()
export class ChannelFollowshipType {
    @Field()
    id: string;

    @Field({ nullable: true })
    channel: ChannelType;

    @Field({ nullable: true })
    user: UserType;

    @Field({ nullable: true })
    joinAt: number;

    @Field({ nullable: true })
    addedBy: UserType;

    @Field({ nullable: true })
    deleted: boolean;

    @Field({ nullable: true })
    createdAt: number;

    @Field({ nullable: true })
    updatedAt: number;
}
