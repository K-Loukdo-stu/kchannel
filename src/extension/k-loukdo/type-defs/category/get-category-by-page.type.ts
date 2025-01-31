import { Field, ObjectType } from "@nestjs/graphql";
import { KLoukdoCategoryType } from "./category.type";

@ObjectType()
export class GetKLoukdoCategoryByPageType {
    @Field(() => [KLoukdoCategoryType])
    category: KLoukdoCategoryType;

    @Field({ nullable: true })
    total: number;

    @Field({ nullable: true })
    page: number;
}