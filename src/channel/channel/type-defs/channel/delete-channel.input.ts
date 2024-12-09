import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export default class DeleteChannelInput {
    @Field()
    id: string;
}
