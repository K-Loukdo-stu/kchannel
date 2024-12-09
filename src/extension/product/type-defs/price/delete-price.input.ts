import { Field, InputType } from "@nestjs/graphql";


@InputType()
export default class DeletePriceInput {
    @Field()
    id: string;
}