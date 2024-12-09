import { Field, InputType } from "@nestjs/graphql";


@InputType()
export default class DeleteExtensionInput {
    @Field()
    id: string;
}