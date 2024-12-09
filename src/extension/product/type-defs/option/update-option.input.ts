import { Field, InputType } from "@nestjs/graphql";


@InputType()
export default class UpdateOptionInput {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    type: string;
}