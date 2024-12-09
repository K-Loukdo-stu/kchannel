import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateManyChannelTypesInput {
    @Field(() => [String])
    productTypes: string[];

    @Field()
    channel: string;
}