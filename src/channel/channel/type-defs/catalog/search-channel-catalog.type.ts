
import { Field, ObjectType } from "@nestjs/graphql";
import { ChannelCatalogType } from "./channel-catalog.type";

@ObjectType()
export default class SearchChannelCatalogsType {

    @Field(() => [ChannelCatalogType])
    channelCatalogs: ChannelCatalogType;

    @Field({nullable:true})
    channelCatalogsCount: number;

}