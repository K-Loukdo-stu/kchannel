import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class DeleteKLoukdoAdvertisementImageInput {
    @Field()
    @IsNotEmpty()
    id: string
}