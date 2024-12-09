import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ChFollowerRemarkFieldInput {
   @Field()
   remark: string;

   @Field()
   value: string;
}

@InputType()
export class SetChFollowerRemarkFieldsInput {
   @Field()
   follower: string;

   @Field()
   channel: string;

   @Field(() => [ChFollowerRemarkFieldInput])
   remarkFields: [ChFollowerRemarkFieldInput];
}