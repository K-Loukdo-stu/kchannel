import { BadRequestException, Injectable } from '@nestjs/common';
import { ExtensionReview } from 'src/extension/extension/models/review.model';
import { transformArrToJson } from "src/utils";
var mongoose = require('mongoose')

@Injectable()
export class ChannelReviewService {
    async create(userId, params): Promise<any> {
        const found = await ExtensionReview.findOne({ createdBy: userId, extension: params.extension });
        if (found) throw new BadRequestException("You can not review again");

        const review = ExtensionReview.build({
            extension: params.extension,
            createdBy: userId,
            feedback: params.feedback,
            rate: params.rate,
        })
        const created = await (await review.save()).populate(['createdBy']);
        return created.toJSON()
    }

    async createReviewChannel(userId, params): Promise<any> {
        const review = ExtensionReview.build({
            channel: params.channel,
            createdBy: userId,
            feedback: params.feedback,
            rate: params.rate,
        })
        const created = await (await review.save()).populate(['createdBy']);
        return created.toJSON()
    }

    async update(params) {
        const reviewId = params.id
        const newUpdate = {
            feedback: params.feedback,
            rate: params.rate,
            createdBy: params.user,
        }
        const updated = ExtensionReview.findByIdAndUpdate(reviewId, newUpdate, { new: true });
        return updated;
    }

    async delete(params) {
        const reviewId = params.id
        const deleted = ExtensionReview.findByIdAndDelete(reviewId);
        return deleted;
    }

    async findById(reviewId: string) {
        const review = await ExtensionReview.findById(reviewId);
        return review.toJSON()
    }

    async findAll() {
        const review = await ExtensionReview.find();
        return transformArrToJson(review)
    }

    async findReviewByExtension(userId, extensionId) {
        const extensionReview = await ExtensionReview.findOne({ createdBy: userId, extension: extensionId }).populate(['createdBy'])
        if (!extensionReview) throw new BadRequestException("Extension review is not found");

        return extensionReview.toJSON();
    }

    async findReviewByChannel(userId, channelId) {
        const channelReview = await ExtensionReview.find({ channel: channelId }).sort({ createdAt: -1 }).populate(['createdBy'])
        if (!channelReview) throw new BadRequestException("Channel review is not found");
        return transformArrToJson(channelReview);
    }

    async rateByChannel(userId, channelId) {
        const findReviewByRate = async (rate = 1) => {
            const reviews = await ExtensionReview.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [mongoose.Types.ObjectId(channelId), "$channel"] },
                            ]
                        }
                    },
                },
                {
                    $sort: { "createdAt": -1 }
                },
                {
                    $group: {
                        "_id": "$createdBy",
                        "id": { "$first": "$_id" },
                        "extension": { "$first": "$extension" },
                        "channel": { "$first": "$channel" },
                        "feedback": { "$first": "$feedback" },
                        "rate": { "$first": "$rate" },
                    }
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$rate", rate] }
                            ]
                        }
                    },
                },
            ]);

            return reviews;
        }

        const rate1Reviews = await findReviewByRate(1);
        const rate2Reviews = await findReviewByRate(2);
        const rate3Reviews = await findReviewByRate(3);
        const rate4Reviews = await findReviewByRate(4);
        const rate5Reviews = await findReviewByRate(5);
        const total = rate1Reviews.length + rate2Reviews.length + rate3Reviews.length + rate4Reviews.length + rate5Reviews.length
        const avgTotal = total / 5

        const percentageRate1Reviews = (rate1Reviews.length * 100 / total).toFixed(2);
        const percentageRate2Reviews = (rate2Reviews.length * 100 / total).toFixed(2);
        const percentageRate3Reviews = (rate3Reviews.length * 100 / total).toFixed(2);
        const percentageRate4Reviews = (rate4Reviews.length * 100 / total).toFixed(2);
        const percentageRate5Reviews = (rate5Reviews.length * 100 / total).toFixed(2);

        return {
            percentageRate1Reviews,
            percentageRate2Reviews,
            percentageRate3Reviews,
            percentageRate4Reviews,
            percentageRate5Reviews,
            total,
            avgTotal
        };
    }
}
