import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"

@ObjectType()
export class SyncUserType {
    @Field()
    id: string;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    phone: string;

    @Field()
    bio: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field(() => JSON, { nullable: true })
    photo: any;

    @Field()
    activated: string;

    @Field()
    role: number;
    
    @Field({ nullable: true })
    createdAt: number;

    @Field({ nullable: true })
    updatedAt: number;
}