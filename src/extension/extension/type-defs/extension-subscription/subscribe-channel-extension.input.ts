import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class SubscribeChannelExtensionInput {
    @Field()
    @IsNotEmpty()
    extension: string;

    @Field()
    @IsNotEmpty()
    channel: string;
}
