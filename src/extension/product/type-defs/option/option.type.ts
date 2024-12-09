import { Field, ObjectType } from "@nestjs/graphql";
import { SubOptionType } from "../sub-option";

@ObjectType()
export class OptionType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    type: string;

    @Field()
    product: string;

    @Field(() => [SubOptionType], { nullable: true })
    subOptions?: string;
}