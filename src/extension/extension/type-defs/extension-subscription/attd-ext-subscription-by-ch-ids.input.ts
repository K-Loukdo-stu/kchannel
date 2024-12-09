import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class AttdExtSubscriptionByChannelIdsInput {
    @Field(() => Number, { nullable: true, defaultValue: 0 })
    pageNumber?: number;

    @Field(() => Number, { nullable: true, defaultValue: 30 })
    limit?: number;
}
