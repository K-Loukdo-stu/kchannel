import { Field, InputType } from "@nestjs/graphql";
import JSON from "graphql-type-json"

@InputType()
export default class UpdateProductInput {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    productType: string;

    @Field(() => JSON, {nullable: true})
    photo: any;
}