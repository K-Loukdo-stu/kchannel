import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import JSON from 'graphql-type-json'

@InputType()
export class SyncAllUsersInput {

   @Field(() => [JSON])
   @IsNotEmpty()
   users: any;

}