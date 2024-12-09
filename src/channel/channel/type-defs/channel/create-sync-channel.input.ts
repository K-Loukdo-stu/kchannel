import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import JSON from "graphql-type-json"

@InputType()
export default class CreateSyncChannelInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    deleted?: boolean;

    @Field()
    createdAt: number;

    @Field()
    updatedAt: number;

    @Field({ nullable: true })
    createdBy: string;

    @Field()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    @IsNotEmpty()
    catalog?: string;

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
}
