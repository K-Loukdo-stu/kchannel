import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateChannelRemarkInput {
   @Field()
   name: string;

   @Field()
   desc: string;

   @Field()
   @IsNotEmpty()
   channel: string;

   @Field(type => [String])
   @IsNotEmpty()
   validationValues: string[];

   @Field()
   @IsNotEmpty()
   type: string;
   
   @Field()
   @IsNotEmpty()
   isRequired: boolean;

   @Field()
   @IsNotEmpty()
   isEnable: boolean;
}