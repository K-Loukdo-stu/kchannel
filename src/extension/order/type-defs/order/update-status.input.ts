import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class UpdateStatusInput {
  @Field()
  id: string;

  @Field()
  @IsNotEmpty()
  status: string;
}