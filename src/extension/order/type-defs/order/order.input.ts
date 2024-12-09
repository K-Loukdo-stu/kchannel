import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class OrderInput {
    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    channel?: string;
}