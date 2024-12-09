import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class SearchChannelInput {
    @Field()
    searchText: string;

    @Field()
    currentPage: number;

    @Field()
    limit: number;
}
