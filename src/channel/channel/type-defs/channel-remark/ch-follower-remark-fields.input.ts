import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class ChFollowerRemarkFieldsInput {
   @Field()
   follower: string;

   @Field()
   channel: string;
}