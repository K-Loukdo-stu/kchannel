import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class UpdateChannelAddressInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    address?: string;

    @Field({ nullable: true })
    latitude?: number;

    @Field({ nullable: true })
    longitude?: number;

}


