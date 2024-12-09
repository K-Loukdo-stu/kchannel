import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class OrderLineInput {
    @Field()
    id: string;
}