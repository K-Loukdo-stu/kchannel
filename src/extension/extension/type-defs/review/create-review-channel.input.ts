import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateReviewChannelInput {

    @Field({ nullable: true })
    feedback?: string;

    @Field()
    @IsNotEmpty()
    rate: number;

    @Field()
    @IsNotEmpty()
    channel: string;
}