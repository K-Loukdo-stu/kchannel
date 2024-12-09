import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

@InputType()
export default class UpdateChannelInfoInput {
    @Field()
    id: string;

    @Field()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    catalog: string;

    @Field()
    public: boolean;

    @Field({ nullable: true })
    desc?: string;

    @Field({ nullable: true })
    bio?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    website?: string;

    @Field({ nullable: true })
    usdExchangeRateInRiel?: string;

    @Field({ nullable: true })
    acceptingCurrency?: string;
}


