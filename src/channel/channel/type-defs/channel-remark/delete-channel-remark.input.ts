import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteChannelRemarkInput {
   @Field()
   id: string;
}