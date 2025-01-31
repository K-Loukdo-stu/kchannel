import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { NatsService } from 'src/nats/nats.service';
import { KLoukdoCategory } from './models/category.model';
import { KLoukdoSubCategory } from './models/sub-category.model';
import { KLoukdoAdvertisementImage } from './models/ads-image.model';
import { KLoukdoPromotion } from './models/promotion.model';
import { PriceService } from '../product/price.service';
import { Product } from '../product/models/product.model';
import { KLoukdoProduct, KLoukdoProductDoc } from './models/kloukdo-product.model';
import { FileDeletedPublisher } from 'src/nats/events/publishers';
import { OptionService } from '../product/option.service';
import { SubOptionService } from '../product/sub-option.service';
var mongoose = require("mongoose");
@Injectable()
export class KLoukdoService {
    constructor(
        private priceService: PriceService,
                private optionService: OptionService,
                private subOptionService: SubOptionService,
        @Inject(forwardRef(() => NatsService)) private natsService: NatsService
    ) { }

    /**
     * Category
     */

    async createCategory(params): Promise<any> {
        const existingCategory = await KLoukdoCategory.findOne({ name: params.name });

        if (existingCategory) {
            throw new BadRequestException(`Category with name "${params.name}" already exists.`);
        }
        const category = KLoukdoCategory.build({
            name: params.name,
            icon: params.icon
        });
        const a = await category.save();
        return a.toJSON();
    }

    async getAllCategory() {
        const category = await KLoukdoCategory.find();
        // console.log(category)
        return category;
    }

    async updateCategory(params) {
        // console.log(params)
        const categoryId = params.id

        const existing = await KLoukdoCategory.findById(categoryId);
        if (!existing) throw new BadRequestException("Category is not found")
        
        const newUpdate = {
            name: params.name,
            icon: params.icon
        }
        const updateCategory = await KLoukdoCategory.findByIdAndUpdate(categoryId, newUpdate, {new: true});
        
        return updateCategory.toJSON();
    }

    async deleteCategory(params) {
        const categoryId = params.id

        const existing = await KLoukdoCategory.findById(categoryId);
        if (!existing) throw new BadRequestException("Category is not found")
        
        const deletedCategory = await KLoukdoCategory.findByIdAndDelete(categoryId);
        return deletedCategory.toJSON();
    }

    /**
     * Sub Category
     */

    async getAllSubCategoryByMainCategory(params) {
        const subCategory = await KLoukdoSubCategory.find({category: params.category}).populate(['category']);
        return subCategory;
    }

    async getAllSubCategoryByPage({ page = 0, limit = 12}) {
        const subCategory = await KLoukdoSubCategory.find().populate(['category']).skip(page * limit).limit(limit).sort('category');
        return subCategory;
    }
    async getAllSubCategories() {
        const subCategory = await KLoukdoSubCategory.find().populate(['category']);
        return subCategory;
    }

    async createSubCategory(params): Promise<any> {
        const existingSubCategory = await KLoukdoSubCategory.findOne({ name: params.name, category: params.category });

        if (existingSubCategory) {
            throw new BadRequestException(`Sub Category with name "${params.name}" in category "${params.category}" already exists.`);
        }
        const subcategory = KLoukdoSubCategory.build({
            name: params.name,
            category: params.category,
            icon: params.icon
        });
        const a = await (await subcategory.save()).populate(['category']);
        return a.toJSON();
    }

    async updateSubCategory(params) {
        const subCategoryId = params.id

        const existing = await KLoukdoSubCategory.findById(subCategoryId);
        if (!existing) throw new BadRequestException("Sub Category is not found")
        
        const newUpdate = {
            name: params.name,
            icon: params.icon,
            category: params.category
        }
        const updateCategory = (await KLoukdoSubCategory.findByIdAndUpdate(subCategoryId, newUpdate, {new: true})).populate(['category']);
        
        return updateCategory;
    }

    async deleteSubCategory (params) {
        const subCategoryId = params.id

        const existing = await KLoukdoSubCategory.findById(subCategoryId);
        if (!existing) throw new BadRequestException("Sub Category is not found");
        
        const deletedCategory = await KLoukdoSubCategory.findByIdAndDelete(subCategoryId);
        return deletedCategory.toJSON();

    }

    /**
     * Categorized Product
     */

    // async createCategorizedProduct (params): Promise<any> {
    //     const { product, category, subCategory } = params;

    //     const exist = await KLoukdoCategorizedProduct.findOne({product: product});
    //     if (exist) throw new BadRequestException("Product Already categorized.");

    //     const existPro = await Product.findById(product);
    //     if (!existPro) throw new BadRequestException("Product doesn't exist");

    //     const existCate = await KLoukdoCategory.findById(category);
    //     if (!existCate) throw new BadRequestException("Category doesn't exist");

    //     const existSubCate = await KLoukdoSubCategory.findById(subCategory);
    //     if (!existSubCate) throw new BadRequestException("Sub Category doesn't exist");

    //     const newCatePro = KLoukdoCategorizedProduct.build({
    //         product: product,
    //         category: category,
    //         subCategory: subCategory
    //     });

    //     const created = await (await newCatePro.save()).populate(['product', 'category', 'subCategory']);
    //     return created.toJSON();
    // }

    // async updateCategorizedProduct (params) {

    //     const exist = await KLoukdoCategorizedProduct.findById(params.id);
    //     if (!exist) throw new BadRequestException("Categorized Product doesn't exist");

    //     const newUpdate = {
    //         product: params.product,
    //         category: params.category,
    //         subCategory: params.subCategory
    //     }

    //     const updated = await (await KLoukdoCategorizedProduct.findByIdAndUpdate(params.id, newUpdate, {new: true})).populate(['product', 'category', 'subCategory']);
    //     return updated;
    // }

    // async deleteCategorizedProduct (params) {
    //     const cateproId = params.id;
    //     const exist = await KLoukdoCategorizedProduct.findById(cateproId);
    //     if (!exist) throw new BadRequestException("Categorized Product doesn't exist");

    //     const deleted = await (await KLoukdoCategorizedProduct.findByIdAndDelete(cateproId)).populate(['product', 'category', 'subCategory']);
    //     return deleted;
    // }

    // async getCategorizedProduct (params) {
    //     const categproId = params.id;
    //     const exist = await KLoukdoCategorizedProduct.findById(categproId).populate(['product', 'category', 'subCategory']);
    //     if (!exist) throw new BadRequestException("Categorized Product doesn't exist");
    //     return exist.toJSON();
    // }

    /**
     * Advertisemnt Image
     */

    async createKLoukdoAdsImage (params): Promise<any> {
        const {name, image, endDate} = params;
        
        const ads = KLoukdoAdvertisementImage.build({
            name: name,
            image: image,
            endDate: endDate
        });
        
        const a = await ads.save();
        return a.toJSON();
    }

    async updateAdsImage (params) {
        const adsId = params.id

        const existing = await KLoukdoAdvertisementImage.findById(adsId);
        if (!existing) throw new BadRequestException("Advertisement is not found")
        
        const newUpdate = {
            name: params.name,
            image: params.image,
            endDate: params.endDate
        }
        const updateAds = (await KLoukdoAdvertisementImage.findByIdAndUpdate(adsId, newUpdate, {new: true}));
        return updateAds;
    }

    async deleteAdsImage (params) {
        const adsId = params.id

        const existing = await KLoukdoAdvertisementImage.findById(adsId);
        if (!existing) throw new BadRequestException("Advertisement is not found")
        
        const deletedAds = await KLoukdoAdvertisementImage.findByIdAndDelete(adsId);
        return deletedAds.toJSON();
    }

    async getAds() {
        const ads = await KLoukdoAdvertisementImage.aggregate([
            { $sample: { size: 3 } },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    image: 1,
                    endDate: 1,
                }
            }
        ]);
        return ads;
    }

    async getAllAds({ page = 0, limit = 15 }) {
        const ads = await KLoukdoAdvertisementImage.aggregate([
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    image: 1,
                    endDate: 1,
                }
            },
            { $skip: page * limit },
            { $limit: limit }
        ]);
        return ads;
    }
    
    /**
     * Promotion
     */

    async createPromotion (params): Promise<any> {
        const existingPromotion = await KLoukdoPromotion.findOne({ product: params.product });

        if (existingPromotion) {
            throw new BadRequestException(`Promotion with product "${params.product}" already exists.`);
        }
        const promo = KLoukdoPromotion.build({
            product: params.product,
            endDate: params.endDate
        });
        const savedPromo = await (await promo.save()).populate(['product']);
        return savedPromo.toJSON();
    }

    async updatePromotion (params) {
        const promoId = params.id;
        const promo = await KLoukdoPromotion.findById(promoId);
        if (!promo) throw new BadRequestException("Promotion is not found");
        
        const newUpdate = {
            product: params.product,
            endDate: params.endDate
        }
        const updatePromo = (await KLoukdoPromotion.findByIdAndUpdate(promoId, newUpdate, {new: true})).populate(['product']);
        return updatePromo;
    }

    async deletePromotion (params) {
        const promoId = params.id;
        const existing = await KLoukdoPromotion.findById(promoId);
        if (!existing) throw new BadRequestException("Promotion is not found")
        
        const deletedPromo = await KLoukdoPromotion.findByIdAndDelete(promoId).populate(['product']);
        return deletedPromo.toJSON();
    }

    async getPromotionByCategory(params) {
        const categoryId = params.category;
        const promotions = await KLoukdoPromotion.aggregate([
        {
            $lookup: {
              from: "kloukdoproducts",
              localField: "product",
              foreignField: "_id",
              as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $match: {
              "product.category": mongoose.Types.ObjectId(categoryId), // Match the provided category ID
            },
        },
        {
            $lookup: {
                from: "kloukdocategories",
                localField: "product.category",
                foreignField: "_id",
                as: "product.category"
            }
        },
        { $unwind: "$product.category" },
        {
            $lookup: {
                from: "kloukdosubcategories",
                localField: "product.subCategory",
                foreignField: "_id",
                as: "product.subCategory"
            }
        },
        { $unwind: "$product.subCategory" },
        {
            $project: {
              _id: 0,
              id: "$_id",
              product: {
                id: "$product._id",
                name: "$product.name",
                category: {
                    id: "$product.category._id",
                    name: "$product.category.name"
                },
                subCategory: {
                    id: "$product.subCategory._id",
                    name: "$product.subCategory.name"
                },
              },
              endDate: "$endDate",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          }
        ]);
        console.log(promotions);
      
        return promotions;
    }

    async getPromotionBySubCategory(params) {
        const subCategoryId = params.subCategory;
        const promotions = await KLoukdoPromotion.aggregate([
        {
            $lookup: {
              from: "kloukdoproducts",
              localField: "product",
              foreignField: "_id",
              as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $match: {
              "product.subCategory": mongoose.Types.ObjectId(subCategoryId), // Match the provided sub category ID
            },
        },
        {
            $lookup: {
                from: "kloukdocategories",
                localField: "product.category",
                foreignField: "_id",
                as: "product.category"
            }
        },
        { $unwind: "$product.category" },
        {
            $lookup: {
                from: "kloukdosubcategories",
                localField: "product.subCategory",
                foreignField: "_id",
                as: "product.subCategory"
            }
        },
        { $unwind: "$product.subCategory" },
        {
            $project: {
              _id: 0,
              id: "$_id",
              product: {
                id: "$product._id",
                name: "$product.name",
                category: {
                    id: "$product.category._id",
                    name: "$product.category.name"
                },
                subCategory: {
                    id: "$product.subCategory._id",
                    name: "$product.subCategory.name"
                },
              },
              endDate: "$endDate",
            },
          }
        ]);
        console.log(promotions);
      
        return promotions;
    }

    async getRandomPromotion () {
        const promo = await KLoukdoPromotion.aggregate([
            { $sample: { size: 2 } },
            {
                $lookup: {
                    from: "kloukdoproducts",
                    localField: "product",
                    foreignField: "_id",
                    as: "product",
                }
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "kloukdocategories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "product.category"
                }
            },
            { $unwind: "$product.category" },
            {
                $lookup: {
                    from: "kloukdosubcategories",
                    localField: "product.subCategory",
                    foreignField: "_id",
                    as: "product.subCategory"
                }
            },
            { $unwind: "$product.subCategory" },
            {
                $lookup: {
                    from: "prices",
                    let: { product_id: '$product._id' },
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
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    product: {
                        id: "$product._id",
                        name: "$product.name",
                        category: {
                            id: "$product.category._id",
                            name: "$product.category.name"
                        },
                        subCategory: {
                            id: "$product.subCategory._id",
                            name: "$product.subCategory.name"
                        },
                        price: { $arrayElemAt: ["$prices", 0] },
                        photos: "$product.photos",
                        createdAt: "$product.createdAt",
                        updatedAt: "$product.updatedAt"
                    },
                    endDate: 1,
                }
            }
        ]);
        return promo;
    }

    async getAllKLoukdoPromotions ({ page = 0, limit = 15}) {
        const promo = await KLoukdoPromotion.aggregate([
            {
                $lookup: {
                    from: "kloukdoproducts",
                    localField: "product",
                    foreignField: "_id",
                    as: "product",
                }
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "kloukdocategories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "product.category"
                }
            },
            { $unwind: "$product.category" },
            {
                $lookup: {
                    from: "kloukdosubcategories",
                    localField: "product.subCategory",
                    foreignField: "_id",
                    as: "product.subCategory"
                }
            },
            { $unwind: "$product.subCategory" },
            { $unwind: "$product.category" },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    product: {
                        id: "$product._id",
                        name: "$product.name",
                        category: {
                            id: "$product.category._id",
                            name: "$product.category.name"
                        },
                        subCategory: {
                            id: "$product.subCategory._id",
                            name: "$product.subCategory.name"
                        },
                    },
                    endDate: 1,
                }
            },
            { $skip: page * limit },
            { $limit: limit }
        ]);
        return promo;
    }

    /**
     * Product
     */
    async createKLoukdoProduct (userId, params): Promise<any> {
        const product = KLoukdoProduct.build({
            id: params.id,
            name: params.name,
            category: params.category,
            subCategory: params.subCategory,
            user: userId,
            photos: params.photos
        });

        const savedProduct = await (await product.save()).populate(['category', 'subCategory']);
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

    async updateKLoukdoProduct(params) {
        const productID = params.id

        const existing = await KLoukdoProduct.findById(productID);
        if (!existing) throw new BadRequestException("Product is not found");
        
        const newUpdate = {
            name: params.name,
            price: params.price,
            category: params.category,
            subCategory: params.subCategory,
            user: params.user,
            photos: params.photos
        }
        const updatedProduct = await KLoukdoProduct.findByIdAndUpdate(productID, newUpdate, { new: true }).populate(['category', 'subCategory', 'user']);
        const updatedProductObj = updatedProduct?.toJSON()
        if (updatedProductObj) {
            const price = await this.priceService.getMainPrice({ productId: productID })
            updatedProductObj['price'] = { ...price }
            // Check if the photo updated
            const existingPhotoUrls = existing['photos'].map(photo => photo['url']);
            for (let photo of newUpdate['photos']) {

                // if (!existingPhotoUrls.includes(photo['url'])) {
                //     // delete in kstorage
                    
                //     this.natsService.getClient(async (client) => {
                //         console.log(client)
                //         await new FileDeletedPublisher(client).publish({
                //             id: existing["photos"]["id"],
                //             type: 'product-photo'
                //         })
                //     })
                // }
            }
        }
        return updatedProductObj;
    }

    async deleteKLoukdoProduct(params) {
        const productID = params.id

        const product = await KLoukdoProduct.findByIdAndDelete(productID);
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
            // this.natsService.getClient(async (client: any) => {
            //     console.log(client)
            //     await new FileDeletedPublisher(client).publish({
            //         id: productObj["photos"]["id"],
            //         type: 'product-photo'
            //     });
            // })
        }
        return productObj;
    }
    
    async findKLoukdoProductById(id: string) {
        const product = await KLoukdoProduct.findById(id).populate(['category', 'subCategory', 'user']);
        if (!product) throw new BadRequestException("Product is not found");
        let productObj = { ...product.toJSON() };

        try {
            const price = await this.priceService.getMainPrice({ productId: productObj['id'] });
            productObj['price'] = price
        } catch (err) { }

        return productObj
    }

    async getAllKLoukdoProduct({ page = 0, limit = 15 }) {
        const products = await KLoukdoProduct.aggregate(
            [
                {
                    $lookup: {
                        from: "kloukdocategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $lookup: {
                        from: "kloukdosubcategories",
                        localField: "subCategory",
                        foreignField: "_id",
                        as: "subCategory"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: '$user' },
                        as: "user",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$user_id"],
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    email: 1,
                                    username: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    activated: 1,
                                    role: 1,
                                    bio: 1,
                                    phone: 1,
                                    photo: 1,
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
                { "$unwind": "$category" },
                { "$unwind": "$subCategory" },
                { "$unwind": "$user" },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        price: { $arrayElemAt: ["$prices", 0] },
                        showOnMenuBoard: 1,
                        category: {
                            _id: "$category._id",
                            id: "$category._id",
                            name: 1,
                            icon: 1,
                        },
                        subCategory: {
                            _id: "$subCategory._id",
                            id: "$subCategory._id",
                            name: 1,
                            icon: 1,
                        },
                        user: 1,
                        photos: 1,
                        createdAt: 1
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

    async searchKLoukdoProductByName(name: string) {
        const products = await KLoukdoProduct.aggregate(
            [   
                {
                    $match: {
                        "name": { $regex: name, '$options': 'i' } 
                    }
                },
                {
                    $lookup: {
                        from: "kloukdocategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $lookup: {
                        from: "kloukdosubcategories",
                        localField: "subCategory",
                        foreignField: "_id",
                        as: "subCategory"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: '$user' },
                        as: "user",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$user_id"],
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    email: 1,
                                    username: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    activated: 1,
                                    role: 1,
                                    bio: 1,
                                    phone: 1,
                                    photo: 1,
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
                { "$unwind": "$category" },
                { "$unwind": "$subCategory" },
                { "$unwind": "$user" },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        price: { $arrayElemAt: ["$prices", 0] },
                        showOnMenuBoard: 1,
                        category: {
                            _id: "$category._id",
                            id: "$category._id",
                            name: 1,
                            icon: 1,
                        },
                        subCategory: {
                            _id: "$subCategory._id",
                            id: "$subCategory._id",
                            name: 1,
                            icon: 1,
                        },
                        user: 1,
                        photos: 1,
                        createdAt: 1
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                { $limit: 30 }
            ]
        );
        return products;
    }

    async findKLoukdoProductByCategory(id: string, limit = 15) {
        const products = await KLoukdoProduct.aggregate(
            [   
                {
                    $lookup: {
                        from: "kloukdocategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $lookup: {
                        from: "kloukdosubcategories",
                        localField: "subCategory",
                        foreignField: "_id",
                        as: "subCategory"
                    }
                },
                { "$unwind": "$category" },
                { "$unwind": "$subCategory" },
                {
                    $match: {
                        "category._id": mongoose.Types.ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: '$user' },
                        as: "user",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$user_id"],
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    email: 1,
                                    username: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    activated: 1,
                                    role: 1,
                                    bio: 1,
                                    phone: 1,
                                    photo: 1,
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
                { "$unwind": "$user" },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        price: { $arrayElemAt: ["$prices", 0] },
                        showOnMenuBoard: 1,
                        category: {
                            _id: "$category._id",
                            id: "$category._id",
                            name: 1,
                            icon: 1,
                        },
                        subCategory: {
                            _id: "$subCategory._id",
                            id: "$subCategory._id",
                            name: 1,
                            icon: 1,
                        },
                        user: 1,
                        photos: 1,
                        createdAt: 1
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                { $limit: limit }
            ]
        );
        return products;    
    }

    async findKLoukdoProductBySubCategory(id: string, limit = 15) {
        const products = await KLoukdoProduct.aggregate(
            [   
                {
                    $lookup: {
                        from: "kloukdocategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $lookup: {
                        from: "kloukdosubcategories",
                        localField: "subCategory",
                        foreignField: "_id",
                        as: "subCategory"
                    }
                },
                { "$unwind": "$category" },
                { "$unwind": "$subCategory" },
                {
                    $match: {
                        "subCategory._id": mongoose.Types.ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        let: { user_id: '$user' },
                        as: "user",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$user_id"],
                                    }
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    id: "$_id",
                                    email: 1,
                                    username: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    activated: 1,
                                    role: 1,
                                    bio: 1,
                                    phone: 1,
                                    photo: 1,
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
                { "$unwind": "$user" },
                {
                    $project: {
                        _id: "$_id",
                        id: "$_id",
                        name: 1,
                        price: { $arrayElemAt: ["$prices", 0] },
                        showOnMenuBoard: 1,
                        category: {
                            _id: "$category._id",
                            id: "$category._id",
                            name: 1,
                            icon: 1,
                        },
                        subCategory: {
                            _id: "$subCategory._id",
                            id: "$subCategory._id",
                            name: 1,
                            icon: 1,
                        },
                        user: 1,
                        photos: 1,
                        createdAt: 1
                    }
                },
                {
                    $sort: { _id: -1 }
                },
                { $limit: limit }
            ]
        );
        return products;    
    }
    
}
