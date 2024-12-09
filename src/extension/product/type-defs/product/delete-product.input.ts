import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class DeleteProductInput {
    @Field()
    id: string;
}