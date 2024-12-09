import { Field, InputType } from "@nestjs/graphql";


@InputType()
export default class ExtensionSubscriptionInput {
    @Field()
    id: string;
}