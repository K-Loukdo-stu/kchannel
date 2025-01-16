import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import JSON from "graphql-type-json"

@InputType()
export class UpdateKLoukdoAdvertisementImageInput {
    @Field()
    @IsNotEmpty()
    id: string;

    @Field({nullable: true})
    name: string;

    @Field(() => JSON, {nullable: true})
    image: any;

    @Field({nullable: true})
    endDate: Date
}