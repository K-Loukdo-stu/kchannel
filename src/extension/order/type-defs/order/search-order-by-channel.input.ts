
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class SearchOrderByChannelInput {

    @Field()
    channel: string;

}