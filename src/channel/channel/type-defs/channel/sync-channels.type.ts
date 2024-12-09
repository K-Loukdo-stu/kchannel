import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SyncChannelsType {
    @Field()
    status: boolean;

}
