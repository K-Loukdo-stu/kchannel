import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class CreateChannelTypeInput {
    @Field()
    @IsNotEmpty()
    productType: string;

    @Field()
    @IsNotEmpty()
    channel: string;
}