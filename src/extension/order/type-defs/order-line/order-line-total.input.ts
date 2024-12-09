import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class OrderLineTotalInput {
    @Field()
    channel: string;
}