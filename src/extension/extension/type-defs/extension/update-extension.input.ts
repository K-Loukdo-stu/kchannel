import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class UpdateExtensionInput {
    
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    keyname: string;

    @Field()
    desc: string;

}