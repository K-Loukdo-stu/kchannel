import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CardInput {
    @Field()
    id: string;
}