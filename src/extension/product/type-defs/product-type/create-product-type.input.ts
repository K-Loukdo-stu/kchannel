import { Field, InputType } from "@nestjs/graphql";
import JSON from "graphql-type-json"

@InputType()
export default class CreateProductTypeInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    channel?: string;

    @Field({ nullable: true })
    catalog?: string;

    @Field(() => JSON, { nullable: true })
    icon?: any;
}