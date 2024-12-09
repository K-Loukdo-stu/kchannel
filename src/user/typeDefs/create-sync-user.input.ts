import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import JSON from "graphql-type-json"

@InputType()
export default class CreateSyncUserInput {
    @Field()
    id: string;

    @Field()
    createdAt: number;

    @Field()
    updatedAt: number;

    @Field()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsNotEmpty()
    firstName: string;

    @Field()
    @IsNotEmpty()
    lastName: string;

    @Field({ nullable: true })
    bio?: string;

    @Field()
    phone: string;

    @Field()
    @IsEmail()
    email: string;

    @Field(() => JSON, { nullable: true })
    photo?: any;

    @Field(() => JSON, { nullable: true })
    cover?: any;

    @Field()
    activated: boolean;

    @Field()
    role: number;
}
