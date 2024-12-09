import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ChannelReviewRateType {
    @Field()
    percentageRate1Reviews: number;

    @Field()
    percentageRate2Reviews: number;

    @Field()
    percentageRate3Reviews: number;

    @Field()
    percentageRate4Reviews: number;

    @Field()
    percentageRate5Reviews: number;

    @Field()
    total: number;

    @Field()
    avgTotal: number;
}
