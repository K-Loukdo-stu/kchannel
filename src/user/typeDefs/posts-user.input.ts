import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class PostsUserInput {
    @Field()
    userID: string;

    @Field()
    currentPage: number;

    @Field()
    limit: number;
}
