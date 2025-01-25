import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class GetKLoukdoProductBySubCategoryInput {
    @Field()
    subCategory: string;

    @Field({nullable: true, defaultValue: 15})
    limit: number;
}