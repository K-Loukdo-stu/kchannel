import { Field, ObjectType } from "@nestjs/graphql";
import { ChannelType } from "../channel/channel.type";
import { UnpopulatedFollowerRemarkFieldType } from "../follower-remark-field/follower-remark-field.type";

@ObjectType()
export class ChannelRemarkType {
   @Field()
   id: string;

   @Field()
   name: string;

   @Field()
   desc: string;

   @Field()
   channel: ChannelType;

   @Field()
   type: string;

   @Field(type => [String])
   validationValues: ChannelType[];

   @Field({ nullable: true })
   isRequired: boolean;

   @Field({ nullable: true })
   isEnable: boolean;

   @Field({ nullable: true })
   followerRemarkField: UnpopulatedFollowerRemarkFieldType;
}