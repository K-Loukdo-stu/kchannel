import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SyncUsersType {
    @Field()
    status: boolean;

}
