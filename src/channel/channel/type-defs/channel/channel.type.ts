import { Field, ObjectType } from "@nestjs/graphql";
import JSON from "graphql-type-json"
import { ChannelCatalogType } from "../catalog";
import { UserType } from "src/user/typeDefs/user.type";
import { ExtensionType } from "src/extension/extension/type-defs/extension";

@ObjectType()
export class ChannelType {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
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
    followshipCount: number;

    @Field()
    createdAt: number;

    @Field()
    updatedAt: number;

    @Field({ nullable: true })
    address: string;

    @Field({ nullable: true })
    latitude: number;

    @Field({ nullable: true })
    longitude: number;

    @Field({ nullable: true })
    public: boolean;
}