import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class RemoveExtensionSubscriptionInput {
    
    @Field()
    id: string;

    @Field()
    deleted: boolean;

}