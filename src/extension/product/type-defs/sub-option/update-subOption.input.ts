import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class UpdateSubOptionInput {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    price: number;

    @Field()
    currency: string;
}