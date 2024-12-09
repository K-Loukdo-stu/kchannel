import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class ExtensionInput {
    @Field()
    id: string;
}