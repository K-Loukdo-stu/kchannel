import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class OrderingInput {
    @Field({ nullable: true })
    inProcessStatus?: string;

    @Field({ nullable: true })
    channel?: string;
}