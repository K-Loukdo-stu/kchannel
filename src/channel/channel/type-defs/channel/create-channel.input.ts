import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import JSON from "graphql-type-json"

@InputType()
export default class CreateChannelInput {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsNotEmpty()
    catalog: string;

    @Field()
    @IsNotEmpty()
    kind: string;

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

    @Field(() => [String], { nullable: true })
    productTypes?: string[];

    @Field(() => JSON, { nullable: true })
    profile?: any;

    @Field(() => JSON, { nullable: true })
    cover?: any;

    @Field({ nullable: true })
    address?: string;

    @Field({ nullable: true })
    latitude?: number;

    @Field({ nullable: true })
    longitude?: number;
}
