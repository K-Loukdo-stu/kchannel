import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class SearchProductsInput {
    @Field()
    searchText: string;

    @Field()
    currentPage: number;

}
