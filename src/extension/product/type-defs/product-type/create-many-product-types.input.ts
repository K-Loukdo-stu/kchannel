import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class CreateManyProductTypesInput {
    @Field()
    channel: string;

    @Field(() => [String])
    names: string[];
}