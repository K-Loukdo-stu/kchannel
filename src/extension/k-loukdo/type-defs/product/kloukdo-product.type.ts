import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"
import { UserType } from "src/user/typeDefs";
import { IsArray, IsOptional } from "class-validator";
import { PriceType } from "src/extension/product/type-defs/price";
import { KLoukdoCategoryType } from "../category/category.type";
import { KLoukdoSubCategoryType } from "../sub-category/sub-category.type";

@ObjectType()
export class KLoukdoProductType {
    @Field()
    page: number;

    @Field()
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true, defaultValue: false })
    showOnMenuBoard: boolean;

    @Field({ nullable: true })
    price: PriceType;

    @Field()
    category: KLoukdoCategoryType;

    @Field()
    subCategory: KLoukdoSubCategoryType;

    @Field()
    user: UserType;

    @Field(() => [JSON], { nullable: true })
    @IsOptional()
    @IsArray()
    photos?: any[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}