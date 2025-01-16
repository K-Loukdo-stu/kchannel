import { Field, ObjectType } from "@nestjs/graphql";
import { KLoukdoProductType } from "../product/kloukdo-product.type";

@ObjectType()
export class KLoukdoPromotionType {
    @Field()
    id: string;
    
    @Field()
    product: KLoukdoProductType;

    @Field()
    endDate: Date;
}