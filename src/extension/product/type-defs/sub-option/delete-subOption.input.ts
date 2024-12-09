import { Field, InputType } from "@nestjs/graphql";


@InputType()
export default class DeleteSubOptionInput {
    @Field()
    id: string;
}