import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class SearchProductTypesInput {
    @Field()
    searchText: string;

    @Field()
    currentPage: number;

}
