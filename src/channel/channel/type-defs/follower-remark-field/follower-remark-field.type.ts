import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UnpopulatedFollowerRemarkFieldType {
  @Field()
  id: string;

  @Field()
  value: string;

  @Field()
  remark: string;

  @Field()
  user: string;

  @Field()
  channel: string;
}