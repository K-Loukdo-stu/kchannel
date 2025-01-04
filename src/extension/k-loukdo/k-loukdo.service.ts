import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NatsService } from 'src/nats/nats.service';
import { KLoukdoCategory } from './models/category.model';
import { KLoukdoSubCategory } from './models/sub-category.model';
import { KLoukdoProduct } from './models/product.model';
import CreateCategoryInput from './type-defs/create-category.input';

@Injectable()
export class KLoukdoService {
    constructor(
        @Inject(forwardRef(() => NatsService)) private natsService: NatsService
    ) { }

    /**
     * Category
     */

    async createCategory(params): Promise<any> {
        const category = KLoukdoCategory.build({
            name: params.name,
            icon: params.icon
        });
        
        const a = await category.save();
        console.log(a.toJSON())
        return a.toJSON();
    }

    async getAllCategory() {
        const category = await KLoukdoCategory.find();
        return category;
    }

    /**
     * Sub Category
     */

    async getAllSubCategoryByMainCategory(categoryId: number) {
        const subCategory = await KLoukdoSubCategory.find({category: categoryId});
        return subCategory;
    }

    async createSubCategory(params): Promise<any> {
        const subcategory = KLoukdoSubCategory.build({
            name: params.name,
            category: params.category,
            icon: params.icon
        });
        
        const a = await subcategory.save();
        return a.toJSON();
    }

    /**
     * Product
     */

    async getProduct (productId: string) {
        const product = await KLoukdoProduct.aggregate(
            [
                {
                    $match: {"_id": {"$in": productId}}
                },
                {
                    $lookup: {
                        from: "categories",
                        let: {product_id: '$_id'},
                        as: "categories",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$products"]
                                    }
                                }
                            },
                            // {
                            //     $project: {
                            //         _id: 1,
                            //         id: "$_id",
                            //         name: 1
                            //     }
                            // }
                        ]
                    }
                }
            ]
        );
    }
}
