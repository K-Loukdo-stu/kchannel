import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class ShowOnBoardProductByChannelInput {
    @Field()
    channel: string;

    @Field()
    limit: number;
}
