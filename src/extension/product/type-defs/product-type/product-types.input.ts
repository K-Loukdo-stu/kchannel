import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class ProcductTypesInput {
    @Field({nullable: true})
    channel?: string;
}