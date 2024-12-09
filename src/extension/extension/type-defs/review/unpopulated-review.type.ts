import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UnpopulatedExtensionReviewType {
    @Field()
    id: string;

    @Field()
    createdBy: string;

    @Field()
    feedback: string;

    @Field()
    rate: number;

    @Field()
    extension: string;
}