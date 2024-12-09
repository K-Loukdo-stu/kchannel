import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class DeleteChannelCatalogInput {
    @Field()
    id: string;
}