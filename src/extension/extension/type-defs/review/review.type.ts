import { Field, ObjectType } from "@nestjs/graphql";
import { UserType } from "src/user/typeDefs/user.type";
import { ExtensionType } from "../extension";
import { ChannelType } from "src/channel/channel/type-defs/channel";

@ObjectType()
export class ChannelReviewType {
    @Field()
    id: string;

    @Field()
    createdBy: UserType;

    @Field()
    feedback: string;

    @Field()
    rate: number;

    @Field()
    extension: ExtensionType;

    @Field()
    channel: ChannelType;

    @Field()
    createdAt: number;
}