import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SetExtensionOnMenuBoardInput {
    @Field()
    channel: string;

    @Field()
    extension: string;

    @Field()
    isOnMenuBoard: boolean;
}