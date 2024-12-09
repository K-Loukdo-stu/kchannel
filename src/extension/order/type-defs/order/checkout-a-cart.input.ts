import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class CheckoutACartInput {
    @Field()
    orderId: string;

    @Field()
    subTotal: number;

    @Field()
    discount: number;

    @Field()
    delivery: number;

    @Field()
    total: number;

    @Field()
    acceptingCurrency: string;

    @Field()
    usdExchangeRateInRiel: number;

    @Field()
    hasCurrencyConversion: boolean;
}