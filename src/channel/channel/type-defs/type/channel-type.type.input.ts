import { Field, ObjectType } from "@nestjs/graphql";
import { ProductTypeType } from "src/extension/product/type-defs";

@ObjectType()
export class ChannelTypeType {
    @Field()
    id: string;

    @Field({nullable: true})
    productType: ProductTypeType;

    @Field()
    channel: string;
}

