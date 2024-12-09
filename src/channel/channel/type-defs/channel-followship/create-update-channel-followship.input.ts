import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class CreateUpdateChannelFollowshipInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    channel: string;

    @Field({ nullable: true })
    user: string;

    @Field()
    joinAt: number;

    @Field({ nullable: true })
    addedBy: string;

    @Field()
    deleted: boolean;

    @Field()
    createdAt: number;

    @Field()
    updatedAt: number;
}