import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class GetKLoukdoProductByCategoryInput {
    @Field()
    category: string;

    @Field({nullable: true, defaultValue: 15})
    limit: number;
}