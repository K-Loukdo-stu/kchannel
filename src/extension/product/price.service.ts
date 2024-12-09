import { BadRequestException, Injectable } from "@nestjs/common";
import { Price, PriceAtts } from "./models/price.model";
import { transformArrToJson } from "src/utils";

@Injectable()
export class PriceService {
    async create(userId, params: PriceAtts): Promise<any> {

        // check max count of prices
        const MAX_PRODUCT_PRICE_COUNT = 10;
        const priceCount = await Price.count({ product: params.product });
        if (priceCount >= MAX_PRODUCT_PRICE_COUNT) {
            throw new BadRequestException("Only 10 prices allowed per product")
        }

        // allow only one main price
        if (params.isMain) {
            const existing = await Price.findOne({ product: params.product, isMain: true });
            if (existing) throw new BadRequestException("Not allow mutiple main price in a product");
        }

        const price = Price.build({
            name: params.name,
            discountPrice: params.discountPrice,
            price: params.price,
            currency: params.currency,
            product: params.product,
            isMain: params.isMain,
            hasDiscount: params.hasDiscount
        });

        const createdPrice = await price.save();
        return createdPrice.toJSON()
    }

    async getMainPrice({ productId }): Promise<any> {
        const found = await Price.findOne({ product: productId, isMain: true })
        if (!found) throw new BadRequestException("Main price is not found");
        return found.toJSON()
    }

    async getPrices({ productId }): Promise<any> {
        const prices = await Price.find({ product: productId }).sort([['createdAt', 1]])
        if (!prices) return [];
        return transformArrToJson(prices);
    }

    async delete(userId, params) {
        const priceId = params.id
        const deletedPrice = Price.findByIdAndDelete(priceId);
        return deletedPrice;
    }

    async deleteByProduct({ productId }) {
        return await Price.deleteMany({ product: productId });
    }

    async update(userId, params) {
        const priceId = params.id
        const newUpdate = {
            name: params.name,
            discountPrice: params.discountPrice,
            price: params.price,
            currency: params.currency,
            hasDiscount: params.hasDiscount
        }
        const updateOption = Price.findByIdAndUpdate(priceId, newUpdate, { new: true });
        return updateOption;
    }
}