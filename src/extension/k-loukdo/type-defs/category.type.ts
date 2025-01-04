import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class KLoukdoCategoryType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field({nullable: true})
    icon: string;
}