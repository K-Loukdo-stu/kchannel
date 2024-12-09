import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TestType {
    @Field()
    id: string;

    @Field()
    checkInAt: string;

    @Field()
    checkOutAt: string;

    @Field()
    status: string;

    @Field()
    remark: string;
}