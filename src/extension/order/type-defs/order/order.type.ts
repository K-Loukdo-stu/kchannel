import { Field, ObjectType } from "@nestjs/graphql";
import { ChannelType } from "src/channel/channel/type-defs/channel";
import { UserType } from "src/user/typeDefs/user.type";
import { UnpopulatedOrderLineType } from "../order-line/unpopulated-order-line.type";

@ObjectType()
export class OrderType {
    @Field()
    id: string;

    @Field()
    user: UserType;

    @Field()
    channel: ChannelType;

    @Field()
    inProcessStatus: string;

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

    @Field({ nullable: true })
    hasCurrencyConversion: boolean

    @Field(() => [UnpopulatedOrderLineType], { nullable: true })
    orderLines: UnpopulatedOrderLineType;

    @Field({ nullable: true })
    lastModifyAt: Date
}