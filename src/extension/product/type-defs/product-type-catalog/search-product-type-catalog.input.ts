import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class SearchProductTypeCatalogInput {
    @Field()
    searchText: string;

    @Field()
    currentPage: number;
}
