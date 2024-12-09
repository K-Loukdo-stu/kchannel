import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateCardInput {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    channel: string;

    @Field()
    extensionKeyname: string;

    @Field()
    autoApproved: boolean;

    @Field()
    deleted: boolean;

    @Field({ nullable: true })
    desc: string;
}