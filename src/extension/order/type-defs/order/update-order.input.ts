import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export default class UpdateOrderInput {
    @Field()
    id: string;

    @Field()
    @IsNotEmpty()
    location: string;

    @Field()
    contact: string;

    @Field()
    stateOrdering: string;
    
}