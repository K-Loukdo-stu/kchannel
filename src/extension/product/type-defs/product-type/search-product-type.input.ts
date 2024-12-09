import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class SearchProductTypeInput {
    @Field()
    searchText: string;

    @Field()
    currentPage: number;

    @Field()
    createBy: string;
}
