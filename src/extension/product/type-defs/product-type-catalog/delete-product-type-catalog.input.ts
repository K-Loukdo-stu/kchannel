import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteProductTypeCatalogInput {
    @Field()
    id: string;
}