import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class DeleteChannelTypeInput {
    @Field()
    id: string;
}