import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class ChannelTypeInput {
    @Field()
    @IsNotEmpty()
    page: number;

    @Field()
    @IsNotEmpty()
    productTypeId: string;
}