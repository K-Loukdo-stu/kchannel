import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class UpdateProductShowOnBoardInput {
    @Field()
    product: string;

    @Field()
    showOnMenuBoard: boolean;
}
