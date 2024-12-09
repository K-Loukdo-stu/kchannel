import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import JSON from 'graphql-type-json'

@InputType()
export class SyncAllChannelFollowshipInput {

   @Field(() => [JSON])
   @IsNotEmpty()
   followerships: any;

//    @Field(() => [JSON], { nullable: true })
//    clonedOptions: any;
}