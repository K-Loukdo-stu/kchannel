import { Field, InputType } from '@nestjs/graphql';
import JSON from "graphql-type-json"

@InputType()
export default class UpdateChannelProfileInput {
    @Field()
    id: string;

    @Field(() => JSON, { nullable: true })
    profile: any;

    @Field(() => JSON, { nullable: true })
    cover: any;
}


