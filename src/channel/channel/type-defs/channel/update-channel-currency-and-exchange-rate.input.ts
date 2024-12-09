import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class UpdateChannelCurrencyAndExchangeRateInput {
    @Field()
    channelId: string;

    @Field()
    currencyCode: string;

    @Field()
    usdExchangeRateInRiel: number;
}


