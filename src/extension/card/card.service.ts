import { BadRequestException, Injectable } from '@nestjs/common';
import { transformArrToJson } from "src/utils";
import { CardMembershipService } from './card-membership.service';
import { Card } from './models/card.model';
var mongoose = require('mongoose')

@Injectable()
export class CardService {
    constructor(private cardMembershipService: CardMembershipService) { }
    async create(params): Promise<any> {
        const card = Card.build({
            name: params.name,
            channel: params.channel,
            extensionKeyname: params.extensionKeyname,
            autoApproved: params.autoApproved,
            deleted: params.deleted,
            desc: params.desc,
        })

        await card.save();

        const found = await this.findById(card.id);
        return found;
    }

    async update(params) {
        const cardId = params.id
        const newUpdate = {
            name: params.name,
            channel: params.channel,
            extension: params.channel,
            autoApproved: params.autoApproved,
            deleted: params.deleted,
            desc: params.desc,
        }
        await Card.findByIdAndUpdate(cardId, newUpdate, { new: true });

        const updated = await this.findById(cardId);
        return updated;
    }

    async updateStatus(params) {
        const cardId = params.id
        const newUpdate = {
            deleted: params.deleted,
        }
        const updated = Card.findByIdAndUpdate(cardId, newUpdate, { new: true });
        return updated;
    }

    async delete(params) {
        const cardId = params.id
        const deleted = Card.findByIdAndDelete(cardId);
        return deleted;
    }

    async findById(cardId: string) {
        const cardMembership = await Card.findById(cardId).populate(['channel']);
        if (!cardMembership) throw new BadRequestException("Card membership is not found")
        let cardMembershipObj = cardMembership.toJSON();

        const cmRes = await this.cardMembershipService.findAllByCard(cardId);
        cardMembershipObj['memberTotal'] = cmRes['total'];
        return cardMembershipObj;
    }

    async findAll() {
        const cardMemberships = await Card.find();
        return transformArrToJson(cardMemberships)
    }
    async findByChannelAndExtension(channelId: string, extensionKeyname: string) {
        const cards = await Card.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ["$channel", mongoose.Types.ObjectId(channelId)] },
                            { $eq: ["$extensionKeyname", extensionKeyname] },
                            { $ne: ["$deleted", true] }
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "cardmemberships",
                    let: { card_id: '$_id' },
                    as: "cardmemberships",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$card", "$$card_id"]
                                }
                            }
                        },
                        {
                            $project: {
                                id: "$_id",
                                user: 1,
                                card: 1,
                                expiredAt: 1,
                                issuedAt: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: "$_id",
                    id: "$_id",
                    name: 1,
                    channel: 1,
                    desc: 1,
                    deleted: 1,
                    autoApproved: 1,
                    extensionKeyname: 1,
                    memberTotal: { $cond: { if: { $isArray: "$cardmemberships" }, then: { $size: "$cardmemberships" }, else: [] } },
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);

        return cards;
    }
}
