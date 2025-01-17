import { Field, InputType } from "@nestjs/graphql";


@InputType()
export default class UpdatePriceInput {
    @Field()
    id: string;
    
    @Field()
    name: string;

    @Field()
    price: number;

    @Field()
    discountPrice: number;

    @Field()
    hasDiscount: boolean;

    @Field()
    currency: string;
}