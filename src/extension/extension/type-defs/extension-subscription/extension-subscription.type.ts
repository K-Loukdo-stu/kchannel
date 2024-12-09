import { Field, ObjectType } from "@nestjs/graphql";
import { ChannelType } from "src/channel/channel/type-defs/channel";
import { ExtensionType } from "../extension";


@ObjectType()
export class ExtensionSubscriptionType {
    @Field()
    id: string;

    @Field()
    extension: ExtensionType;

    @Field()
    expiredAt: string;

    @Field()
    issuedAt: string;

    @Field({ nullable: true })
    deleted: boolean;

    @Field({ nullable: true })
    isOnMenuBoard: boolean;

    @Field()
    channel: ChannelType;
}