import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class UpdateChannelRemarkRequiredInput {
   @Field()
   id: string;

   @Field()
   isRequired: boolean;
}