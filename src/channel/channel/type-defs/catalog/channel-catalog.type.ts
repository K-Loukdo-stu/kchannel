import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ChannelCatalogType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    channelKind: string;

    @Field({ nullable: true })
    productType: string;
}