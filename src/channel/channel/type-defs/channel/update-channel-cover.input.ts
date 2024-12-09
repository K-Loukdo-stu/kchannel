import { Field, InputType } from '@nestjs/graphql';
import JSON from "graphql-type-json"

@InputType()
export default class UpdateChannelCoverInput {
    @Field()
    id: string;

    @Field(() => JSON)
    cover: any;
}


