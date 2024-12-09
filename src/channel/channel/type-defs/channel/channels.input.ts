import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class ChannelsInput {
    @Field()
    page: number;

    @Field()
    limit: number;

    @Field({ nullable: true })
    catalog: string;
}