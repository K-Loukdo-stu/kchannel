import { BadRequestException, Injectable } from "@nestjs/common";
import { transformArrToJson } from "src/utils";
import { ProductType, ProductTypeAttrs } from "./models/product-type.model"
import { ProductService } from "./product.service";
var mongoose = require('mongoose')

@Injectable()
export class ProductTypeService {
    constructor(
        private productService: ProductService
    ) { }

    async create(userId: string, params: ProductTypeAttrs): Promise<any> {
        const { name, icon, catalog, channel } = params;
        const existing = await ProductType.findOne({ name, channel });
        if (existing) throw new BadRequestException('Product type name already exists')

        const productType = ProductType.build({ name, icon, catalog, channel, createdBy: userId })
        const CreateProductType = await productType.save();
        return CreateProductType.toJSON()
    }

    async createMany(userId: string, params): Promise<any> {
        const { names, channel } = params;

        // find by channel
        const existings = await ProductType.find({ channel });
        const existingNames = existings.map(e => e.name);
        const filteredProductTypeNames = names.filter((name: string) => !existingNames.includes(name));

        // create many product type objects in an array
        const productTypes = filteredProductTypeNames.map((name: string) => {
            return { name, channel, createdBy: userId }
        });

        // create many
        await ProductType.insertMany(productTypes);

        const all = await ProductType.find({ channel });
        return transformArrToJson(all);
    }

    async update(params: ProductTypeAttrs) {
        const { id, name, icon, catalog } = params;
        const newUpdate = {}
        if (name) newUpdate['name'] = name;
        if (icon) newUpdate['icon'] = icon;
        if (catalog) newUpdate['catalog'] = catalog;
        const updateProductType = await ProductType.findByIdAndUpdate(id, newUpdate, { new: true });
        return updateProductType;
    }

    async delete(productTypeId: string) {
        // cannot delete if products existed
        const existing = await ProductType.findById(productTypeId);
        if (!existing) throw new BadRequestException("The product type is not found");

        const products = await this.productService.findByProductTypeAndChannel({ productTypeId, channelId: existing['channel'] });
        if (products.length > 0) throw new BadRequestException("The product type cannot be removed. It may contain product(s)")

        const deletedProductType = await ProductType.findByIdAndDelete(productTypeId);
        return deletedProductType;
    }

    async findById(productTypeID: string) {
        const productType = await ProductType.findById(productTypeID);
        return productType.toJSON()
    }

    async findSystemDefined(catalogId: string) {
        const productTypes = await ProductType.find({ channel: null, catalog: catalogId });
        return transformArrToJson(productTypes);
    }

    async findAll(params) {
        const channelId = params?.channel;

        let productTypes = [];
        if (channelId) {
            productTypes = await ProductType.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: ['$channel', mongoose.Types.ObjectId(channelId)]
                        }
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        let: { product_type_id: '$_id' },
                        as: "products",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$productType", "$$product_type_id"] },
                                            { $eq: ["$channel", mongoose.Types.ObjectId(channelId)] }
                                        ]
                                    }
                                },
                            },
                            {
                                $count: "total"
                            }
                        ]
                    },
                },
                {
                    $project: {
                        id: "$_id",
                        name: 1,
                        channel: 1,
                        productTotal: { $arrayElemAt: ["$products.total", 0] },
                        photoProductType: 1
                    }
                },
            ])

        } else {
            productTypes = await ProductType.find();
            productTypes = transformArrToJson(productTypes);
        }

        if (!productTypes)
            return []

        return productTypes
    }

    async searchProductTypes(searchText?: string, currentPage?: number, createBy?: string) {
        if (currentPage === 0) {
            currentPage = 1
        }
        currentPage = currentPage - 1

        let cond = {
            $and: [
                { createBy },
                {
                    $or: [{ name: { $regex: '.*' + searchText + '.*' } }, { price: { $regex: '.*' + searchText + '.*' } }]
                }
            ]
        }
        const limit = 6;
        let productTypesCount = 0;
        const productTypes = await ProductType.aggregate(
            [
                {
                    $match: cond
                },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        catalog: 1,
                        icon: 1,
                        channelType: 1,
                        productTotal: 1,
                        photoProductType: 1,
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
            productTypesCount = productTypes.length;
        } else {
            productTypesCount = await ProductType.count();
        }
        const pagesCount = Math.ceil(productTypesCount / limit)
        return {
            productTypes: productTypes || [],
            productTypesCount: pagesCount,
        };
    }

    async searchTypes(searchText?: string, currentPage?: number) {
        if (currentPage === 0) {
            currentPage = 1
        }
        currentPage = currentPage - 1

        let cond = {
            $or: [{ name: { $regex: '.*' + searchText + '.*' } }, { price: { $regex: '.*' + searchText + '.*' } }]

        }
        const limit = 6;
        let productTypesCount = 0;
        const productTypes = await ProductType.aggregate(
            [
                {
                    $match: cond
                },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        catalog: 1,
                        icon: 1,
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                { $skip: currentPage * limit },
                { $limit: limit }
            ]
        );
        const catalog = await ProductType.populate(productTypes, { path: "catalog" });
        if (searchText) {
            productTypesCount = productTypes.length;
        } else {
            productTypesCount = await ProductType.count();
        }
        const pagesCount = Math.ceil(productTypesCount / limit)
        return {
            productTypes: productTypes || [],
            productTypesCount: pagesCount,
        };
    }
}

