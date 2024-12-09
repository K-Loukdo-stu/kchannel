import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SyncChannelFollowshipType {
    @Field()
    status: boolean;

}
