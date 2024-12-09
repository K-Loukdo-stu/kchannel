import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export class ChannelExtensionsInput {
    @Field()
    @IsNotEmpty()
    channel: string;
}