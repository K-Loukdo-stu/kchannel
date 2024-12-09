import { Field, ObjectType } from "@nestjs/graphql";
import { ChannelType } from "src/channel/channel/type-defs/channel";

@ObjectType()
export class CardType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    channel: ChannelType;

    @Field()
    extensionKeyname: string;

    @Field()
    autoApproved: boolean;

    @Field()
    deleted: boolean;

    @Field({ nullable: true })
    desc: string;

    @Field({ nullable: true })
    memberTotal: number;

    @Field({nullable: true})
    createdAt?: Date;

    @Field({nullable: true})
    updatedAt?: Date;
}