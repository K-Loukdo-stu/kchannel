import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsFQDN, IsNotEmpty, Length } from 'class-validator';
import JSON from "graphql-type-json"

@InputType()
export default class UpdateChannelInput {
    @Field()
    id: string;

    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    catalog: string;

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

    @Field(() => JSON, { nullable: true })
    profile?: any;

    @Field(() => JSON, { nullable: true })
    cover?: any;
}


