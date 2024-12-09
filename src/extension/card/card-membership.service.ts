import { BadRequestException, Injectable } from '@nestjs/common';
import { transformArrToJson } from "src/utils";
import { CardMembership } from './models/card-membership.model';
var mongoose = require('mongoose')
@Injectable()
export class CardMembershipService {
    async createMany({ users = [], card }) {
        let cardMembershipArr = [];
        for (let i = 0; i < users.length; i++) {
            cardMembershipArr.push({
                expiredAt: Date.now(),
                issuedAt: Date.now(),
                user: users[i],
                card: card,
                approved: true,
            });
        };

        const existings = await CardMembership.find({ card, user: { $in: users } });
        if (existings.length) {
            throw new BadRequestException("Some user is already existing");
        }

        await CardMembership.insertMany(cardMembershipArr);

        const founds = await CardMembership.find({ card, user: { $in: users } }).populate(["user", "card"]);
        return transformArrToJson(founds);
    }

    async updateMany({ users = [], card }) {
        const existingCardMemberships = await CardMembership.find({ card });
        const addingUserIds = users.filter((user) => existingCardMemberships.findIndex(u => u.user.toString() == user) < 0);
        const removingCardMemberships = existingCardMemberships.filter((cm) => users.findIndex(u => u == cm.user.toString()) < 0);

        // Removing userIds that existed before
        const removingUserIds = removingCardMemberships.map(cm => cm.user);
        await this.deleteMany({ users: removingUserIds, card });

        // Adding new userIds that are not existed before
        let addingCardMembershipArr = [];
        for (let i = 0; i < addingUserIds.length; i++) {
            addingCardMembershipArr.push({
                expiredAt: Date.now(),
                issuedAt: Date.now(),
                user: addingUserIds[i],
                card: card,
                approved: true,
            });
        };
        await CardMembership.insertMany(addingCardMembershipArr);

        const founds = await CardMembership.find({ card }).populate(["user", "card"]);
        return transformArrToJson(founds);
    }


    async approve(user: string, card: string): Promise<any> {
        const found = await CardMembership.findOne({ user: user, card: card });
        if (!found) throw new BadRequestException("The request is not found");

        const membeship = await CardMembership.findByIdAndUpdate(found.id, { approved: true }, { new: true }).populate(['card', 'user']);
        return membeship.toJSON();

    }

    async reject(user: string, card: string): Promise<any> {
        const found = await CardMembership.findOne({ user: user, card: card });
        if (!found) throw new BadRequestException("The request is not found");

        await CardMembership.findByIdAndDelete(found.id);
        return found.toJSON();
    }

    async update(params) {
        // const found = await CardMembership.findOne({ user: params.user, card: params.card });
        // if (!found || found?.approved == true) throw new BadRequestException("You can not approved again");
        const cardMembershipId = params.id
        const newUpdate = {
            expiredAt: params.expiredAt,
            issuedAt: params.issuedAt,
            user: params.user,
            card: params.card,
            approved: params.approved,
        }
        const updated = CardMembership.findByIdAndUpdate(cardMembershipId, newUpdate, { new: true });
        return updated;
    }

    async deleteMany({ users = [], card }) {
        const existings = await CardMembership.find({ card, user: { $in: users } }).populate(["user", "card"]);
        await CardMembership.deleteMany({ card, user: { $in: users } });
        return existings;
    }

    async delete(params) {
        const cardMembershipId = params.id
        const deleted = CardMembership.findByIdAndDelete(cardMembershipId);
        return deleted;
    }

    async findById(cardMembershipId: string) {
        const cardMembership = await CardMembership.findById(cardMembershipId);
        return cardMembership.toJSON()
    }

    async findAll() {
        const cardMemberships = await CardMembership.find();
        return transformArrToJson(cardMemberships)
    }
    async findAllByCard(cardId: string) {
        const cardMembership = await CardMembership.find({ card: cardId, deleted: { $ne: true } }).populate(['card', 'user']);
        let total = cardMembership.length
        return {
            cardMembership: transformArrToJson(cardMembership) || [],
            total: total
        }
    }

    async findByCard(cardId: string, page: number, filter: string, sortBy: string) {
        let filterMatchAndCond: any[] = [
            {
                $or: [
                    {
                        "user.firstName": {
                            $regex: filter,
                            $options: 'i',
                        }
                    },
                    {
                        "user.lastName": {
                            $regex: filter,
                            $options: 'i',
                        }
                    },
                    {
                        "user.username": {
                            $regex: filter,
                            $options: 'i',
                        }
                    }
                ],
            }
        ]

        if (sortBy == "APPROVED") {
            filterMatchAndCond.push({ "approved": true });
        } else if (sortBy == "REJECTED") {
            filterMatchAndCond.push({ "approved": false });
        }

        const cardMembershipsByCard = await CardMembership.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: ["$card", mongoose.Types.ObjectId(cardId)]
                    }
                }
            },
            {
                $lookup: {
                    from: "cards",
                    let: { card_id: "$card" },
                    as: "card",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$card_id"]
                                }
                            }
                        },
                        {
                            $project: {
                                id: "$_id",
                                name: 1,
                                autoApproved: 1,
                                extensionKeyname: 1,
                                desc: 1,
                                deleted: 1
                            }
                        }
                    ]
                }
            },
            { "$unwind": "$card" },
            {
                $lookup: {
                    from: "users",
                    let: { user_id: "$user" },
                    as: "user",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$user_id"]
                                }
                            }
                        },
                        {
                            $project: {
                                id: "$_id",
                                email: 1,
                                username: 1,
                                firstName: 1,
                                lastName: 1,
                                activated: 1
                            }
                        }
                    ]
                }
            },
            { "$unwind": "$user" },
            {
                $match: {
                    $and: filterMatchAndCond
                }
            },
            {
                $project: {
                    "id": "$_id",
                    user: 1,
                    card: 1,
                    approved: 1,
                    expiredAt: 1,
                    issuedAt: 1,
                }
            }
        ]).skip(page * 7).limit(7);
        let total = cardMembershipsByCard.length

        if (!cardMembershipsByCard?.length)
            return {
                cardMembership: (cardMembershipsByCard) || [],
                total: total
            }
        return {
            cardMembership: (cardMembershipsByCard) || [],
            total: total
        }
    }
}
