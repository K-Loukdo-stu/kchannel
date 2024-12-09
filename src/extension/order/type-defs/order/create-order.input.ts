import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class CreateOrderInput {

    @Field()
    @IsNotEmpty()
    createdBy?: string;

    @Field()
    @IsNotEmpty()
    channel?: string;

    @Field()
    @IsNotEmpty()
    location: string;

    @Field()
    contact: string;

    @Field()
    stateOrdering: string;

    @Field()
    subTotal: number;

    @Field()
    fee: number;

    @Field()
    delivery: number;

    @Field()
    total: number;

}