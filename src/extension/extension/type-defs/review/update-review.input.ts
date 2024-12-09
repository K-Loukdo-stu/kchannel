import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateChannelReviewInput {

    @Field()
    id: string;

    @Field()
    feedback: string;

    @Field()
    rate: number;
}