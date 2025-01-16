import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"

@ObjectType()
export class KLoukdoAdvertisementImageType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(() => JSON, {nullable: true})
    image?: any;

    @Field()
    endDate: Date;
}