import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class CreateChannelCatalogInput {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    channelKind: string;
}