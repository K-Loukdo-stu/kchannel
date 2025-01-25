import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class GetAllKLoukdoProductInput {
    @Field()
    page: number;

    @Field({nullable: true, defaultValue: 15})
    limit: number;
}