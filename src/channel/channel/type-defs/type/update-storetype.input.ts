import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class UpdateChannelTypeInput {
    @Field()
    id: string;

    @Field()
    productType: string;

    @Field()
    channel: string;
}