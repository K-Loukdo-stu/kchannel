import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateOrderLineQtyInput {
    @Field()
    id: string;

    @Field()
    quantity: number;

}