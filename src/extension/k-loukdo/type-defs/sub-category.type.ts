import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class KLoukdoSubCategoryType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    category: string;

    @Field({nullable: true})
    icon: string;
}