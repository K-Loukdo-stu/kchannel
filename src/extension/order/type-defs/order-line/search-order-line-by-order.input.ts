
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class SearchOrderLineByOrderInput {

    @Field()
    order: string;

}