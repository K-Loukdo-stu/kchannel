import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PaginateType {
    @Field()
    total:number;
    @Field()
    current_page: number;

}