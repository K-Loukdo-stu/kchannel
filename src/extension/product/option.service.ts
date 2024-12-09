import { BadRequestException, Injectable } from "@nestjs/common";
import { Option } from "./models/option.model";
import { SubOption } from "./models/sub-option.model";
var mongoose = require('mongoose')

const OptionType = {
    single: "SINGLE",
    multiple: "MULTIPLE",
    quantity: "QUANTITY"
}

@Injectable()
export class OptionService {
    async create(userId, params): Promise<any> {
        const optionTypes = Object.values(OptionType);
        const isOptTypeValid = optionTypes.includes(params.type);
        if (!isOptTypeValid) {
            throw new BadRequestException("Invalid option type");
        }

        const option = Option.build({
            type: params.type,
            name: params.name,
            product: params.product,
        });

        const createdOption = await option.save();
        return createdOption.toJSON();
    }

    async delete(userId, params) {
        const optionId = params.id
        const deletedOption = Option.findByIdAndDelete(optionId);
        // delete all sub-options
        await SubOption.deleteMany({ option: optionId });
        return deletedOption;

    }

    async deleteByProduct({ productId }) {
        return await Option.deleteMany({ product: productId });
    }

    async update(userId, params) {
        const optionTypes = Object.values(OptionType);
        const isOptTypeValid = optionTypes.includes(params.type);
        if (!isOptTypeValid) {
            throw new BadRequestException("Invalid option type");
        }

        const optionId = params.id
        const newUpdate = {
            name: params.name,
            type: params.type,
            product: params.product
        }
        const updateOption = Option.findByIdAndUpdate(optionId, newUpdate, { new: true });
        return updateOption;
    }

    async findAllOptionsByProduct(params) {
        const productId = params?.product;
        const result = await Option.aggregate([
            {
                $match: {
                    product: mongoose.Types.ObjectId(productId)
                }
            },
            {
                $lookup: {
                    from: "productsuboptions",
                    let: { option_id: '$_id' },
                    as: "subOptions",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$option", "$$option_id"],
                                }
                            }
                        },
                        {
                            $project: {
                                id: "$_id",
                                name: 1,
                                price: 1,
                                option: 1,
                                currency: 1,
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    id: "$_id",
                    name: 1,
                    product: 1,
                    type: 1,
                    subOptions: 1
                }
            },
            {
                $sort: { id: 1 }
            }
        ])
        return result;
    }
}