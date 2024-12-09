import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class UpdateChannelRemarkEnableInput {
   @Field()
   id: string;

   @Field()
   isEnable: boolean;
}