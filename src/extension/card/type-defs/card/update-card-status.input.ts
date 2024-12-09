import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateCardStatusInput {
    @Field()
    id: string;

    @Field()
    deleted: boolean;
}