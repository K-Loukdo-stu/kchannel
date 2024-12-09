import { BadRequestException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Product, ProductAttrs, ProductDoc } from "./models/product.model";
import { PriceService } from "./price.service";
import { OptionService } from "./option.service";
import { SubOptionService } from "./sub-option.service";
import { NatsService } from "src/nats/nats.service";
import { FileDeletedPublisher } from "src/nats/events/publishers";
import { transformArrToJson } from "src/utils";
import UpdateProductShowOnBoardInput from "./type-defs/product/update-product-show-on-board.input";
import ShowOnBoardProductByChannelInput from "./type-defs/product/show-on-board-products-by-channel.input";
var mongoose = require('mongoose');

@Injectable()
export class ProductService {
    constructor(
        private priceService: PriceService,
        private optionService: OptionService,
        private subOptionService: SubOptionService,
        @Inject(forwardRef(() => NatsService)) private natsService: NatsService,
    ) { }

    async create(userId, params): Promise<any> {
        const product = Product.build({
            id: params.id,
            name: params.name,
            productType: params.productType,
            channel: params.channel,
            photo: params.photo
        });

        const savedProduct = await (await product.save()).populate(['productType']);
        let productObj: any = savedProduct.toJSON();

        // Create a price
        const createdPrice = await this.priceService.create(userId, {
            price: params.price,
            discountPrice: params.discountPrice,
            hasDiscount: params.hasDiscount,
            name: "Main",
            isMain: true,
            currency: params.currency,
            product: productObj.id,
        });

        productObj = {
            ...productObj,
            price: createdPrice
        }
        return productObj
    }

    async update(userId, params) {
        const productID = params.id

        const existing = await Product.findById(productID);
        if (!existing) throw new BadRequestException("Product is not found")

        const newUpdate = {
            name: params.name,
            price: params.price,
            productType: params.productType,
            channel: params.channel,
            photo: params.photo
        }
        const updatedProduct = await Product.findByIdAndUpdate(productID, newUpdate, { new: true }).populate(['productType', 'channel']);
        const updatedProductObj = updatedProduct?.toJSON()
        if (updatedProductObj) {
            const price = await this.priceService.getMainPrice({ productId: productID })
            updatedProductObj['price'] = { ...price }

            // Check if the photo updated
            if (newUpdate['photo']["id"] != existing["photo"]["id"]) {
                // delete in kstorage
                this.natsService.getClient(async (client) => {
                    await new FileDeletedPublisher(client).publish({
                        id: existing["photo"]["id"],
                        type: 'product-photo'
                    })
                })
            }
        }

        return updatedProductObj;
    }

    async delete(userId, params) {
        const productID = params.id

        const product = await Product.findByIdAndDelete(productID);
        const productObj = product?.toJSON();
        if (productObj) {
            // delte related prices
            this.priceService.deleteByProduct({ productId: productObj.id });

            // delete related product options
            this.optionService.deleteByProduct({ productId: productObj.id });

            // delete related product sub-option
            this.subOptionService.deleteByProduct({ productId: productObj.id });

            // Delete photo file
            // Delete in S3
            this.natsService.getClient(async (client: any) => {
                await new FileDeletedPublisher(client).publish({
                    id: productObj["photo"]["id"],
                    type: 'product-photo'
                });
            })
        }
        return productObj;
    }

    async findById(id: string) {
        const product = await Product.findById(id).populate(['productType', 'channel']);
        if (!product) throw new BadRequestException("Product is not found");
        let productObj = { ...product.toJSON() };

        try {
            const price = await this.priceService.getMainPrice({ productId: productObj['id'] });
            productObj['price'] = price
        } catch (err) { }

        return productObj
    }

    async findFullSetProductsByIds(productIds: string[]) {
        const productObjectIds = productIds.map((id) => mongoose.Types.ObjectId(id));
        const products = await Product.aggregate(
            [
                {
                    $match: { "_id": { "$in": productObjectIds } }
                },
                {
                    $lookup: {
                        from: "prices",
                        let: { product_id: '$_id' },
                        as: "prices",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$product", "$$product_id"]
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    name: 1,
                                    price: 1,
                                    currency: 1,
                                    discountPrice: 1,
                                    hasDiscount: 1,
                                    product: 1,
                                    isMain: 1,
                                }
                            }
                        ]
                    },
                },
                {
                    $lookup: {
                        from: "productoptions",
                        let: { product_id: '$_id' },
                        as: "options",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$product", "$$product_id"]
                                    }
                                },
                            },
                            {
                                $lookup: {
                                    from: "productsuboptions",
                                    let: { option_id: '$_id' },
                                    as: "choices",
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: {
                                                    $eq: ["$option", "$$option_id"]
                                                }
                                            },
                                        },
                                        {
                                            $project: {
                                                _id: 1,
                                                id: "$_id",
                                                name: 1,
                                                price: 1,
                                                currency: 1,
                                                option: 1,
                                                product: 1,
                                                quantity: 1
                                            }
                                        }
                                    ]
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    name: 1,
                                    type: 1,
                                    product: 1,
                                    choices: 1
                                }
                            }
                        ]
                    },
                },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        productType: 1,
                        prices: 1,
                        options: 1,
                        channel: 1,
                        photo: 1,

                    }
                },
            ]
        );

        return products;
    }

    async getAll({ page = 0, limit = 15 }) {
        const products = await Product.aggregate(
            [
                {
                    $lookup: {
                        from: "producttypes",
                        localField: "productType",
                        foreignField: "_id",
                        as: "productType"
                    }
                },
                {
                    $lookup: {
                        from: "channels",
                        let: { channel_id: '$channel' },
                        as: "channel",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$channel_id"],
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    name: 1,
                                    type: 1,
                                    desc: 1,
                                    phone: 1,
                                    email: 1,
                                    catalog: 1,
                                    createdBy: 1,
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "prices",
                        let: { product_id: '$_id' },
                        as: "prices",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$product", "$$product_id"] },
                                            { $eq: ["$isMain", true] },
                                        ]
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    name: 1,
                                    price: 1,
                                    currency: 1,
                                    discountPrice: 1,
                                    hasDiscount: 1,
                                    product: 1,
                                    isMain: 1,
                                }
                            }
                        ]
                    },
                },
                { "$unwind": "$productType" },
                { "$unwind": "$channel" },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        price: { $arrayElemAt: ["$prices", 0] },
                        showOnMenuBoard: 1,
                        productType: {
                            _id: "$productType._id",
                            id: "$productType._id",
                            name: 1,
                            catalog: 1,
                            icon: 1,
                            createdBy: 1,
                            channel: 1,
                        },
                        channel: 1,
                        photo: 1,
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                { $skip: page * limit },
                { $limit: limit }
            ]
        );

        return products
    }

    async findByProductTypeAndChannel({ productTypeId, channelId }) {
        const productDocs = await Product.find({ productType: productTypeId, channel: channelId });
        return transformArrToJson(productDocs)
    }

    async findByProductType({ productTypeId, page = undefined, limit = undefined }) {
        const productDocs = Product.find({ productType: productTypeId });
        let products: any = [];
        if (page != undefined && limit != undefined) {
            products = await productDocs.skip(page * limit).limit(limit);
        } else {
            products = await productDocs;
        }

        if (!products?.length)
            return []

        return transformArrToJson(products);
    }

    async findProductsByChannel(params) {
        const { pageNumber, limit } = params;

        let cond: any = { channel: mongoose.Types.ObjectId(params.channel) }
        if (mongoose.Types.ObjectId.isValid(params.productType)) {
            cond = {
                $and: [
                    { channel: mongoose.Types.ObjectId(params.channel) },
                    { productType: mongoose.Types.ObjectId(params.productType) }
                ]
            }
        }

        const products = await Product.aggregate(
            [
                {
                    $match: cond
                },
                {
                    $lookup: {
                        from: "producttypes",
                        localField: "productType",
                        foreignField: "_id",
                        as: "productType"
                    }
                },
                {
                    $lookup: {
                        from: "prices",
                        let: { product_id: '$_id' },
                        as: "prices",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$product", "$$product_id"],
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    name: 1,
                                    price: 1,
                                    currency: 1,
                                    discountPrice: 1,
                                    hasDiscount: 1,
                                    product: 1,
                                    isMain: 1,
                                }
                            }
                        ]
                    },
                },
                { "$unwind": "$productType" },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        showOnMenuBoard: 1,
                        price: { $arrayElemAt: ["$prices", 0] },
                        productType: {
                            _id: "$productType._id",
                            id: "$productType._id",
                            name: 1,
                            catalog: 1,
                            icon: 1,
                            createdBy: 1,
                            channel: 1,
                        },
                        channel: 1,
                        photo: 1,
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                { $skip: pageNumber * limit },
                { $limit: limit }
            ]
        );

        return products;
    }

    async findAllProductByChannel(params) {
        const products = await Product.find({
            channel: params.channel,
        }).populate(['productType', 'channel']);
        if (!products?.length)
            return []
        return products;
    }

    async searchByName(name: string): Promise<[ProductDoc]> {
        // const product = await Product.find({"name": {$regex: '.*' + name + '.*' } } ).populate(['productType', 'channel']);
        const product = await Product.find({ "name": { $regex: name, '$options': 'i' } }).limit(30);
        return product as [ProductDoc];
    }

    async searchChannelProducts({ searchText, currentPage = 0, channel, limit = 15 }) {
        let cond = {
            $and: [
                { channel: mongoose.Types.ObjectId(channel) },
                { name: { $regex: '.*' + searchText + '.*', $options: "ix" } }
            ]
        }

        const products = await Product.aggregate(
            [
                {
                    $match: cond
                },
                {
                    $lookup: {
                        from: "channels",
                        localField: "channel",
                        foreignField: "_id",
                        as: "channel"
                    }
                },
                {
                    $lookup: {
                        from: "producttypes",
                        localField: "productType",
                        foreignField: "_id",
                        as: "productType"
                    }
                },
                { "$unwind": "$channel" },
                { "$unwind": "$productType" },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        price: 1,
                        showOnMenuBoard: 1,
                        productType: {
                            _id: "$productType._id",
                            id: "$productType._id",
                            name: 1,
                            catalog: 1,
                            icon: 1,
                            createdBy: 1,
                            channel: 1,
                        },
                        channel: {
                            _id: "$channel._id",
                            id: "$channel._id",
                            name: 1,
                            type: 1,
                            desc: 1,
                            phone: 1,
                            email: 1,
                            catalog: 1,
                            createdBy: 1,
                        },
                        photo: 1,
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                { $skip: currentPage * limit },
                { $limit: limit }
            ]
        );

        const productsCount = await Product.count({ channel: channel });
        const pagesCount = Math.ceil(productsCount / limit)

        return {
            products: products || [],
            productTotal: productsCount,
            pageTotal: pagesCount,
        };
    }

    async searchProducts(searchText?: string, currentPage?: number) {
        if (currentPage === 0) {
            currentPage = 1
        }
        currentPage = currentPage - 1

        let cond = {
            $or: [{ name: { $regex: '.*' + searchText + '.*' } }, { price: { $regex: '.*' + searchText + '.*' } }]
        }
        const limit = 6;
        let productsCount = 0;
        const products = await Product.aggregate(
            [
                {
                    $match: cond
                },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        price: 1,
                        showOnMenuBoard: 1,
                        productType: 1,
                        channel: 1,
                        photo: 1,
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
            productsCount = products.length;

        } else {
            productsCount = await Product.count();
        }
        const pagesCount = Math.ceil(productsCount / limit)
        return {
            products: products || [],
            productsCount: pagesCount,
        };
    }

    async searchProductsByChannel(searchText?: string, currentPage?: number, channelId?: string) {
        if (currentPage === 0) {
            currentPage = 1
        }
        currentPage = currentPage - 1
        let cond = {
            $and: [
                { channel: channelId },
                {
                    $or: [{ name: { $regex: '.*' + searchText + '.*' } }, { price: { $regex: '.*' + searchText + '.*' } }]
                }
            ]
        }
        const limit = 6;
        let productsCount = 0;
        const products = await Product.aggregate(
            [
                {
                    $match: cond
                },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        price: 1,
                        showOnMenuBoard: 1,
                        productType: 1,
                        channel: 1,
                        photo: 1,
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
            productsCount = products.length;

        } else {
            productsCount = await Product.count();
        }
        const pagesCount = Math.ceil(productsCount / limit)
        return {
            products: products || [],
            productsCount: pagesCount,
        };
    }

    async updateProductShowOnMenuBoard(params: UpdateProductShowOnBoardInput) {
        const { product, showOnMenuBoard } = params;
        const productData = await Product.findByIdAndUpdate(product, { showOnMenuBoard }, { new: true }).populate(['productType', 'channel']);
        return productData.toJSON();
    }

    async findShowOnMenuBoardProductsByChannel(params: ShowOnBoardProductByChannelInput) {
        const products = await Product.aggregate(
            [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$channel", mongoose.Types.ObjectId(params.channel)] },
                                { $eq: ["$showOnMenuBoard", true] }
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "producttypes",
                        localField: "productType",
                        foreignField: "_id",
                        as: "productType"
                    }
                },
                {
                    $lookup: {
                        from: "prices",
                        let: { product_id: '$_id' },
                        as: "prices",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$product", "$$product_id"],
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    name: 1,
                                    price: 1,
                                    currency: 1,
                                    discountPrice: 1,
                                    hasDiscount: 1,
                                    product: 1,
                                    isMain: 1,
                                }
                            }
                        ]
                    },
                },
                { "$unwind": "$productType" },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        price: { $arrayElemAt: ["$prices", 0] },
                        productType: {
                            _id: "$productType._id",
                            id: "$productType._id",
                            name: 1,
                            catalog: 1,
                            icon: 1,
                            createdBy: 1,
                            channel: 1,
                        },
                        channel: 1,
                        showOnMenuBoard: 1,
                        photo: 1,
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                {
                    $limit: params.limit
                }
            ]
        );

        return products;
    }
}
