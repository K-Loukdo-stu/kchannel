import { Field, InputType } from "@nestjs/graphql";
import JSON from "graphql-type-json"

@InputType()
export class UpdateProductTypeCatalogInput {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => JSON, { nullable: true })
    icon: any;
}