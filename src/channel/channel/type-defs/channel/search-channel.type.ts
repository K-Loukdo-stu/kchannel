
import { Field, ObjectType } from "@nestjs/graphql";
import { ChannelType } from "./channel.type";

@ObjectType()
export default class SearchChannelType {

    @Field(() => [ChannelType])
    channels: ChannelType;

    @Field()
    channelTotal: number;

    @Field()
    pageTotal: number;

}