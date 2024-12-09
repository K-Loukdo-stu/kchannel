import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class LoadOrderCartInput {
    @Field()
    channel: string;
}