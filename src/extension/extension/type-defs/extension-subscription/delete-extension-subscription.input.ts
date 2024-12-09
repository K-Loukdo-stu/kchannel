import { Field, InputType } from "@nestjs/graphql";


@InputType()
export default class DeleteExtensionSubscriptionInput {
    @Field()
    id: string;
}