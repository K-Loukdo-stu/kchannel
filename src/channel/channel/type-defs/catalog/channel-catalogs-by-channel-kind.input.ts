import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class ChannelCatalogsByChannelKindInput {
    @Field()
    channelKind: string;
}