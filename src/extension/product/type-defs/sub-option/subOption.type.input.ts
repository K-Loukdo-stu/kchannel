import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class SubOptionType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    price: number;

    @Field()
    currency: string;

    @Field()
    option: string;
}