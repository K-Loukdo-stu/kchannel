import { Field, ObjectType } from "@nestjs/graphql";
import { UnpopulatedExtensionSubscriptionType } from "../extension-subscription/unpopulated-extension-subscription.type";
import { UnpopulatedExtensionReviewType } from "../review/unpopulated-review.type";

@ObjectType()
export class ExtensionType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    keyname: string;

    @Field()
    desc: string;

    @Field({ nullable: true })
    review: UnpopulatedExtensionReviewType;

    @Field({ nullable: true })
    subscription: UnpopulatedExtensionSubscriptionType;
}