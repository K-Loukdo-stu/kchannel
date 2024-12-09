import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PriceType {
    @Field()
    id: string;
    
    @Field()
    name: string;

    @Field()
    price: number;

    @Field()
    discountPrice: number;

    @Field()
    currency: string;

    @Field()
    product: string; 

    @Field()
    isMain: boolean; 

    @Field()
    hasDiscount: boolean; 
}