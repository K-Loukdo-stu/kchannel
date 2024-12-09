import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateCardInput {
    @Field()
    name: string;

    @Field()
    @IsNotEmpty()
    channel: string;

    @Field()
    @IsNotEmpty()
    extensionKeyname: string;

    @Field()
    @IsNotEmpty()
    autoApproved: boolean;

    @Field()
    @IsNotEmpty()
    deleted: boolean;

    @Field({ nullable: true })
    desc: string;
}