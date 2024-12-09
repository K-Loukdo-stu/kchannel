import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class SearchProductInput {
    @Field()
    searchText: string;

    @Field()
    currentPage: number;

    @Field({ nullable: true, defaultValue: 15 })
    limit: number;

    @Field()
    channel: string;
}
