import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CardsByChannelAndExtensionInput {
    @Field()
    @IsNotEmpty()
    channelId: string;

    @Field()
    @IsNotEmpty()
    extensionKeyname: string;
}