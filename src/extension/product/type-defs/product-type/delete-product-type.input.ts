import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class DeleteProductTypeInput {
    @Field()
    id: string;
}