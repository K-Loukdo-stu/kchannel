import { Injectable } from "@nestjs/common";
import { transformArrToJson } from "src/utils";
import { ChannelCatalog } from "./models/catalog.model";
import { CreateChannelCatalogInput } from "./type-defs/catalog";

@Injectable()
export class ChannelCatalogService {
    async create(userId, params: CreateChannelCatalogInput): Promise<any> {
        const { channelKind, name } = params;

        const found = await ChannelCatalog.findOne({ name: name, channelKind: channelKind });
        if (found) throw new Error('Channel Catalog already exists');

        const channelCatalog = ChannelCatalog.build({
            name: name,
            channelKind: channelKind,
        })
        const CreateChannelCatalog = await channelCatalog.save();
        return CreateChannelCatalog.toJSON()
    }

    async update(userId, params) {
        const channelCatalogId = params.id
        const newUpdate = {
            name: params.name,
        }
        const updateChannelCatalog = ChannelCatalog.findByIdAndUpdate(channelCatalogId, newUpdate, { new: true });
        return updateChannelCatalog;
    }

    async delete(userId, params) {
        const channelCatalogId = params.id
        const deleteChannelCatalog = ChannelCatalog.findByIdAndDelete(channelCatalogId);
        return deleteChannelCatalog;
    }

    async findById(channelCatalogId: string) {
        const channelCatalog = await ChannelCatalog.findById(channelCatalogId);
        return channelCatalog.toJSON()
    }

    async findAll() {
        const channelCatalogs = await ChannelCatalog.find();
        return transformArrToJson(channelCatalogs)
    }

    async findByChannelKind(channelKind: string) {
        const channelCatalogs = await ChannelCatalog.find({ channelKind });
        return transformArrToJson(channelCatalogs)
    }

    async searchChannelCatalogs(searchText?: string, currentPage?: number) {
        if (currentPage === 0) {
            currentPage = 1
        }
        currentPage = currentPage - 1
        let cond = {
            $or: [{ name: { $regex: '.*' + searchText + '.*' } }]
        }
        const limit = 6;
        let channelCatalogCount = 0;
        const channelCatalogs = await ChannelCatalog.aggregate(
            [
                {
                    $match: cond
                },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                { $skip: currentPage * limit },
                { $limit: limit }
            ]
        );
        if (searchText) {
            channelCatalogCount = channelCatalogs.length;

        } else {
            channelCatalogCount = await ChannelCatalog.count();
        }
        const pagesCount = Math.ceil(channelCatalogCount / limit)
        return {
            channelCatalogs: channelCatalogs || [],
            channelCatalogsCount: pagesCount,
        };
    }
}