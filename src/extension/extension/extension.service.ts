import { Injectable } from '@nestjs/common';
import { Extension } from './models/extension.model';
var mongoose = require('mongoose')

@Injectable()
export class ExtensionService {

    async create(params): Promise<any> {
        const extension = Extension.build({
            name: params.name,
            keyname: params.keyname,
            desc: params.desc,
        })
        const created = await extension.save();
        return created.toJSON()
    }

    async update(params) {
        const extensionId = params.id
        const newUpdate = {
            name: params.name,
            keyname: params.keyname,
            desc: params.desc,
        }
        const updated = Extension.findByIdAndUpdate(extensionId, newUpdate, { new: true });
        return updated;
    }

    async delete(params) {
        const extensionId = params.id
        const deleted = Extension.findByIdAndDelete(extensionId);
        return deleted;
    }

    async findById(channelExtensionId: string) {
        const extension = await Extension.findById(channelExtensionId);
        return extension.toJSON()
    }

    async findAll(userId: string, channelId: string) {
        const extensions = await Extension.aggregate([
            {
                $lookup: {
                    from: "extensionreviews",
                    let: { extension_id: '$_id' },
                    as: "extensionreviews",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$extension", "$$extension_id"] },
                                        { $eq: ["$createdBy", mongoose.Types.ObjectId(userId)] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                id: "$_id",
                                createdBy: 1,
                                extension: 1,
                                feedback: 1,
                                rate: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "extensionsubscriptions",
                    let: { extension_id: '$_id' },
                    as: "extensionsubscriptions",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$extension", "$$extension_id"] },
                                        { $eq: ["$channel", mongoose.Types.ObjectId(channelId)] },
                                        { $ne: ["$deleted", true] }
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                id: "$_id",
                                extension: 1,
                                expiredAt: 1,
                                issuedAt: 1,
                                deleted: 1,
                            }
                        }
                    ]
                }
            },
            {
                "$group": {
                    "_id": "$_id",
                    "name": { "$first": "$name" },
                    "desc": { "$first": "$desc" },
                    "keyname": { "$first": "$keyname" },
                    "review": { "$first": { "$arrayElemAt": ["$extensionreviews", 0] } },
                    "subscription": { "$first": { "$arrayElemAt": ["$extensionsubscriptions", 0] } },
                }
            },
            { "$unwind": { path: "$review", preserveNullAndEmptyArrays: true } },
            { "$unwind": { path: "$subscription", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    id: "$_id",
                    name: 1,
                    desc: 1,
                    keyname: 1,
                    review: 1,
                    subscription: 1,
                }
            }
        ]);

        return extensions;
    }

    async findByChannel(userId: string, channelId: string) {
        const extensions = await Extension.aggregate([
            {
                $lookup: {
                    from: "extensionsubscriptions",
                    let: { extension_id: '$_id' },
                    as: "extensionsubscriptions",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$extension", "$$extension_id"] },
                                        { $eq: ["$channel", mongoose.Types.ObjectId(channelId)] },
                                        { $ne: ["$deleted", true] }
                                    ]
                                }
                            }
                        }, {
                            $project: {
                                id: "$_id",
                                extension: 1,
                                expiredAt: 1,
                                issuedAt: 1,
                                deleted: 1,
                            }
                        }
                    ]
                }
            },
            { "$unwind": "$extensionsubscriptions" },
            {
                "$group": {
                    "_id": "$_id",
                    "name": { "$first": "$name" },
                    "desc": { "$first": "$desc" },
                    "keyname": { "$first": "$keyname" },
                }
            },
            {
                $project: {
                    id: "$_id",
                    name: 1,
                    desc: 1,
                    keyname: 1,
                }
            }
        ]);

        return extensions;
    }
}
