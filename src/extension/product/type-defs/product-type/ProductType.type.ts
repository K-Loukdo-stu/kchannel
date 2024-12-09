import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"

@ObjectType()
export class ProductTypeType {
    @Field()
    id: string;

    @Field()
    name: string;
    

    @Field({nullable: true})
    channelType?: string;


    @Field({nullable: true})
    productTotal?: number;

    @Field(() => JSON, {nullable: true})
    photoProductType?: any;
}