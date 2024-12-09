import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class UnpopulatedExtensionSubscriptionType {
    @Field()
    id: string;

    @Field()
    extension: string;

    @Field()
    expiredAt: string;

    @Field()
    issuedAt: string;

    @Field({ nullable: true })
    deleted: boolean;

    @Field()
    channel: string;
}