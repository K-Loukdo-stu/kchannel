import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { transformArrToJson } from "src/utils";
import { ExtensionSubscription } from './models/extension-subscription.model';
import { ChannelExtensionKeynames } from '@htkradass/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { httpRequestAdapter, httpRequestUrls } from 'src/utils/request';
var mongoose = require('mongoose');


@Injectable()
export class ExtensionSubscriptionService {
    constructor(
        private httpService: HttpService
    ) { }
    async subscribe(channelId: string, extensionId: string): Promise<any> {

        const found = await ExtensionSubscription.findOne({ channel: channelId, extension: extensionId }).populate(['channel', 'extension']);
        if (found) {
            if (found.deleted == false) {
                return found.toJSON();
            } else {
                const extensionSub = await ExtensionSubscription.findByIdAndUpdate(found.id, { deleted: false }, { new: true }).populate(['channel', 'extension']);
                return extensionSub.toJSON();
            }
        }

        // Create new subscription
        const subscription = ExtensionSubscription.build({
            extension: extensionId,
            channel: channelId,
            expiredAt: Date.now(),
            issuedAt: Date.now(),
            deleted: false,
        })

        const created = await (await subscription.save()).populate(['channel', 'extension']);
        return created.toJSON();
    }

    async unsubscribe(channelId: string, extensionId: string): Promise<any> {
        const found = await ExtensionSubscription.findOne({ extension: extensionId, channel: channelId });
        if (!found || found?.deleted == true) {
            throw new BadRequestException("You cannot unsubscribe again");
        }

        const extensionUnsub = await ExtensionSubscription.findByIdAndUpdate(found.id, { deleted: true, isOnMenuBoard: false }, { new: true })
        return extensionUnsub.toJSON();
    }

    async update(params) {
        const subscriptionId = params.id
        const newUpdate = {
            extension: params.extension,
            channel: params.channel,
            expiredAt: params.expiredAt,
            issuedAt: params.issuedAt,
            deleted: params.deleted,
        }
        const updated = ExtensionSubscription.findByIdAndUpdate(subscriptionId, newUpdate, { new: true });
        return updated;
    }

    async remove(params) {
        const subscriptionId = params.id
        const newUpdate = {
            deleted: params.deleted,
        }
        const updated = ExtensionSubscription.findByIdAndUpdate(subscriptionId, newUpdate, { new: true });
        return updated;
    }

    async delete(params) {
        const subscriptionId = params.id
        const deleted = ExtensionSubscription.findByIdAndDelete(subscriptionId);
        return deleted;
    }

    async findById(extensionSubscriptionId: string) {
        const subscription = await ExtensionSubscription.findById(extensionSubscriptionId);
        return subscription.toJSON()
    }

    async findAll() {
        const subscriptions = await ExtensionSubscription.find();
        return transformArrToJson(subscriptions)
    }

    async findMySubscriptions() {
        const subscriptions = await ExtensionSubscription.find({});
        return transformArrToJson(subscriptions)
    }

    async findByChannel(channelId: string) {
        const extensionSubscriptions = await ExtensionSubscription.find({ channel: channelId, deleted: false }).populate('extension');
        return transformArrToJson(extensionSubscriptions);
    }

    async setExtensionOnMenuBoard(channelId: string, extensionId: string, isOnMenuBoard: boolean) {
        const found = await ExtensionSubscription.findOne({ channel: channelId, extension: extensionId });
        if (!found) throw new BadRequestException('The extension subscription is not found')

        const updated = await ExtensionSubscription.findByIdAndUpdate(found.id, { isOnMenuBoard }, { new: true }).populate(['extension', 'channel']);

        // update other extension to be out of menu board
        await ExtensionSubscription.updateMany({ channel: extensionId, id: { $ne: found.id } }, { isOnMenuBoard: false });

        return updated.toJSON();
    }

    async findMenuBoardExtensionSubscription({ channelId }) {
        const found = await ExtensionSubscription.findOne({ channel: channelId, isOnMenuBoard: true }).populate(['channel', 'extension']);
        if (!found) throw new BadRequestException('The extension subscription is not found')
        return found.toJSON();
    }

    async findAttdSubscriptionByChannelIds(req: any, pageNumber: number = 0, limit: number = 30) {
        // fetch api json from a url
        let channelIds = [];
        try {
            channelIds = await httpRequestAdapter({
                url: `${httpRequestUrls.KTALK}/channel/my-own-channel-ids`,
                data: {},
                req,
                httpService: this.httpService
            }).post();
        } catch (error) {
            throw new InternalServerErrorException("Failed to fetch channel ids");
        }

        // find all subscriptions by channel ids and the extension is not deleted and extentions "keyname" == "Attendance", please join tables by using aggrigate
        // using aggregate
        // convert channelIds to ObjectId
        const channelObjectIds = channelIds.map(id => mongoose.Types.ObjectId(id));
        const subscriptions = await ExtensionSubscription.aggregate([
            {
                $match: {
                    // use $expr
                    $expr: {
                        // use $in
                        $and: [
                            { $in: ['$channel', channelObjectIds] },
                            // { $ne: ['$deleted', true] }
                        ]
                    },
                }
            },
            {
                $lookup: {
                    from: 'extensions',
                    localField: 'extension',
                    foreignField: '_id',
                    as: 'extension'
                }
            },
            {
                $unwind: '$extension'
            },
            // join with channel and 
            {
                $lookup: {
                    from: 'channels',
                    localField: 'channel',
                    foreignField: '_id',
                    as: 'channel'
                }
            },
            {
                $unwind: '$channel'
            },
            {
                $match: {
                    'extension.keyname': ChannelExtensionKeynames.ATTENDANCE_SYSTEM
                }
            },
            // project everyting and add rename _id to id and also rename channel._id to channel.id
            {
                $project: {
                    id: '$_id',
                    channel: {
                        id: '$channel._id',
                        name: '$channel.name',
                        profile: '$channel.profile',
                        kind: '$channel.kind',
                    },
                    extension: {
                        id: '$extension._id',
                        name: '$extension.name',
                        keyname: '$extension.keyname',
                        description: '$extension.description',
                    },
                    expiredAt: 1,
                    issuedAt: 1,
                    deleted: 1,
                    isOnMenuBoard: 1,
                }
            }
            // add pagination
        ]).skip(pageNumber * limit).limit(limit);
        return subscriptions;
    }
}
