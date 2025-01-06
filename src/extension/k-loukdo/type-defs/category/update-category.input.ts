import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import JSON from "graphql-type-json"

@InputType()
export default class UpdateKLoukdoCategoryInput {
    @Field()
    @IsNotEmpty()
    id: string;

    @Field({nullable: true})
    name: string;

    @Field(() => JSON, {nullable: true})
    icon: any;
}