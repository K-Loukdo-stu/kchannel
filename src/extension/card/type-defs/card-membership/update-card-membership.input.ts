import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class UpdateCardMembershipInput {
    @Field()
    id: string;

    @Field()
    expiredAt: string;

    @Field()
    issuedAt: string;

    @Field({nullable: true})
    card: string;

    @Field({nullable: true})
    user: string;

    @Field({nullable: true})
    approved: boolean;
}