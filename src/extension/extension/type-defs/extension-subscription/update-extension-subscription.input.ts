import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class UpdateExtensionSubscriptionInput {
    
    @Field()
    id: string;

    @Field()
    extension: string;

    @Field()
    expiredAt: number;

    @Field()
    issuedAt: number;

    @Field()
    deleted: boolean;

    @Field()
    channel: string;
}