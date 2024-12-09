import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";


@InputType()
export default class CreateExtensionSubscriptionInput {

    @Field()
    @IsNotEmpty()
    extension: string;

    @Field()
    @IsNotEmpty()
    expiredAt: number;

    @Field()
    @IsNotEmpty()
    issuedAt: number;

    @Field()
    @IsNotEmpty()
    deleted: boolean;

    @Field()
    @IsNotEmpty()
    channel: string;
}
