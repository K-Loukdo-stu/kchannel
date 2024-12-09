import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"

@ObjectType()
export class UnpopulatedOrderLineType {
    @Field()
    id: string;

    @Field()
    order: string;

    @Field()
    product: string;

    @Field(() => JSON, { nullable: true })
    clonedProduct: any;

    @Field(() => JSON, { nullable: true })
    clonedBasePrice: any;

    @Field(() => [JSON], { nullable: true })
    clonedOptions: any;

    @Field()
    price: number;

    @Field()
    currency: string;

    @Field({ nullable: true })
    shortDesc: string;

    @Field()
    qty: number;
    
    @Field()
    choiceKey: string;
}