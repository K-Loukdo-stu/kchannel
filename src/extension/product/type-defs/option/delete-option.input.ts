import { Field, InputType } from "@nestjs/graphql";


@InputType()
export default class DeleteOptionInput {
    @Field()
    id: string;
}