// import { Field, ObjectType } from "@nestjs/graphql";
// import JSON from "graphql-type-json"

// @ObjectType()
// export class SyncChannelType {

//     @Field()
//     id: string;

//     @Field()
//     deleted: boolean;

//     @Field()
//     name: string;

//     @Field()
//     kind: string;

//     @Field({ nullable: true })
//     bio?: string;

//     @Field({ nullable: true })
//     desc?: string;

//     @Field({ nullable: true })
//     phone?: string;

//     @Field({ nullable: true })
//     email?: string;

//     @Field({ nullable: true })
//     website?: string;

//     @Field({ nullable: true })
//     catalog?: string;

//     @Field({ nullable: true })
//     createdBy: string;

//     @Field(() => JSON, { nullable: true })
//     profile?: any;

//     @Field(() => JSON, { nullable: true })
//     cover?: any;

//     @Field({ nullable: true })
//     createdAt: number;

//     @Field({ nullable: true })
//     updatedAt: number;

// }

import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"
import { ChannelCatalogType } from "../catalog";
import { UserType } from "src/user/typeDefs/user.type";
import { ExtensionType } from "src/extension/extension/type-defs/extension";

@ObjectType()
export class SyncChannelType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    kind: string;

    @Field({ nullable: true })
    catalog: ChannelCatalogType;

    @Field({ nullable: true })
    bio: string;

    @Field({ nullable: true })
    desc: string;

    @Field({ nullable: true })
    phone: string;

    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    website: string;

    @Field(() => [String])
    productTypes: string[];

    @Field({ nullable: true })
    menuBoardExtension: ExtensionType;

    @Field({ nullable: true })
    createdBy: UserType;

    @Field(() => JSON, { nullable: true })
    profile?: any;

    @Field(() => JSON, { nullable: true })
    cover?: any;

    @Field()
    acceptingCurrency: string;

    @Field()
    usdExchangeRateInRiel: string;

    @Field({ nullable: true })
    createdAt: number;

    @Field({ nullable: true })
    updatedAt: number;
}