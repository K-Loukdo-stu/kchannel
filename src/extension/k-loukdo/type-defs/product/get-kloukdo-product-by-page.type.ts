import { Field, ObjectType } from "@nestjs/graphql";
import { KLoukdoProductType } from "./kloukdo-product.type";

@ObjectType()
export class GetKLoukdoProductByPageType {
    @Field(() => [KLoukdoProductType])
    product: KLoukdoProductType;

    @Field({ nullable: true })
    total: number;

    @Field({ nullable: true })
    page: number;
}