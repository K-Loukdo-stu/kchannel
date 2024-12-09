import { Injectable } from "@nestjs/common";
import { SubOption } from "./models/sub-option.model"


@Injectable()
export class SubOptionService {
    async create(userId, params): Promise<any> {
        const subOption = SubOption.build({
            name: params.name,
            price: params.price,
            currency: params.currency,
            option: params.option,
            product: params.product
        })

        const CreateSubOption = await subOption.save();
        return CreateSubOption.toJSON()
    }

    async delete(userId, params) {
        const subOptionId = params.id
        const deleteSubOption = SubOption.findByIdAndDelete(subOptionId);
        return deleteSubOption;
    }

    async deleteByProduct({ productId }) {
        const res = await SubOption.deleteMany({ product: productId });
        return res;
    }

    async update(userId, params) {
        const subOptionId = params.id
        const newSubOption = {
            name: params.name,
            price: params.price,
            currency: params.currency
        }
        const updateSubOption = SubOption.findByIdAndUpdate(subOptionId, newSubOption, { new: true });
        return updateSubOption;
    }

    async findAllSubOptionsByOption(params) {
        const subOptions = await SubOption.find({
            option: params.option
        }).sort({ _id: -1 })

        if (!subOptions?.length)
            return []
        return subOptions;
    }

}
