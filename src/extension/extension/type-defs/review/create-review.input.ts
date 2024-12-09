import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export  class CreateChannelReviewInput {

    @Field()
    @IsNotEmpty()
    feedback: string;

    @Field()
    @IsNotEmpty()
    rate: number;

    @Field()
    @IsNotEmpty()
    extension: string;
}