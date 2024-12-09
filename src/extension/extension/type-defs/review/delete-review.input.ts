import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteChannelReviewInput {
    @Field()
    id: string;
}