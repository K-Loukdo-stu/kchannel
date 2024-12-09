import { Field, Int, ObjectType } from "@nestjs/graphql";
import JSON from 'graphql-type-json';
@ObjectType()
export class UserType {
    @Field()
    id: string;

    @Field()
    username: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    phone: string;

    @Field({ nullable: true })
    bio: string;

    @Field({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    lastName: string;

    @Field(() => JSON, { nullable: true })
    photo: any;

    @Field({ nullable: true })
    activated: string;

    @Field({ nullable: true })
    role: number;

    @Field({ nullable: true })
    createdAt: number;

    @Field({ nullable: true })
    updatedAt: number;
}