import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class UpdateChannelCatalogInput {
    @Field()
    id: string;

    @Field()
    name: string;
    
    @Field()
    productType: string;
}