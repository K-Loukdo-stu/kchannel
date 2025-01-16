import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class DeleteKLoukdoProductInput {
    @Field()
    id: string;
}