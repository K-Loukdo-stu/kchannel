import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ChannelRemarkInput {
   @Field()
   id: string;
}