import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"

@ObjectType()
export class KLoukdoCategoryType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field({nullable: true})
    icon?: string;
}