import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import JSON from 'graphql-type-json'

@InputType()
export class SyncAllChannelsInput {

   @Field(() => [JSON])
   @IsNotEmpty()
   channels: any;

}