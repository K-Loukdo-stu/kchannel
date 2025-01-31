import { Args, Context, Directive, Mutation, Resolver, Query} from '@nestjs/graphql';
import { KLoukdoService } from './k-loukdo.service';
import { UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '@htkradass/nestcommon';
import { CreateKLoukdoCategorySchema } from './schemas/category/creat-categories.schema';
import CreateCategoryInput from './type-defs/category/create-category.input';
import { KLoukdoCategoryType } from './type-defs/category/category.type';
import { KLoukdoSubCategoryType } from './type-defs/sub-category/sub-category.type';
import { CreateKLoukdoSubCategorySchema } from './schemas/sub-category/create-sub-categories.schema';
import CreateKLoukdoSubCategoryInput from './type-defs/sub-category/create-sub-category.input';
import { UpdateKLoukdoCategorySchema } from './schemas/category/update-category.schema';
import UpdateKLoukdoCategoryInput from './type-defs/category/update-category.input';
import { DeleteKLoukdoCategorySchema } from './schemas/category/delete-category.schema';
import DeleteKLoukdoCategoryInput from './type-defs/category/delete-category.input';
import GetKLoukdoSubCategoryByCategoryInput from './type-defs/sub-category/all-sub-category.input';
import { UpdateKLoukdoSubCategorySchema } from './schemas/sub-category/update-sub-category.schema';
import UpdateKLoukdoSubCategoryInput from './type-defs/sub-category/update-sub-category.input';
import { DeleteKLoukdoSubCategorySchema } from './schemas/sub-category/delete-sub-category.schema';
import DeleteKLoukdoSubCategoryInput from './type-defs/sub-category/delete-sub-category.input';
import { KLoukdoAdvertisementImage } from './models/ads-image.model';
import { CreateKLoukdoAdsImageSchema } from './schemas/ads-image/create-ads-image.schema';
import CreateKLoukdoAdvertisementImageInput from './type-defs/ads-image/create-ads-image.input';
import { UpdateKLoukdoAdvertisementImageInput } from './type-defs/ads-image/update-ads-image.input';
import { UpdateKLoukdoAdvertisementImageSchema } from './schemas/ads-image/update-ads-image.schema';
import { DeleteKLoukdoAdvertisementImageSchema } from './schemas/ads-image/delete-ads-image.schema';
import { DeleteKLoukdoAdvertisementImageInput } from './type-defs/ads-image/delete-ads-image.input';
import { KLoukdoAdvertisementImageType } from './type-defs/ads-image/ads-image.type';
import { KLoukdoPromotionType } from './type-defs/promotion/promotion.type';
import { CreateKLoukdoPromotionSchema } from './schemas/promotion/create-promotion.schema';
import CreateKLoukdoPromotionInput from './type-defs/promotion/create-promotion.input';
import { UpdateKLoukdoPromotionSchema } from './schemas/promotion/update-promotion.schema';
import UpdateKLoukdoPromotionInput from './type-defs/promotion/update-promotion.input';
import { DeleteKLoukdoPromotionSchema } from './schemas/promotion/delete-promotion.schema';
import DeleteKLoukdoPromotionInput from './type-defs/promotion/delete-promotion.input';
import GetKLoukdoPromotionByCategoryInput from './type-defs/promotion/get-promotion-by-category.input';
import { KLoukdoCategorizedProductType } from './type-defs/categorized-product/categorized-product.type';
import CreateKLoukdoCategorizedProductInput from './type-defs/categorized-product/create-categorized-product.input';
import { CreateKLoukdoCategorizedProductSchema } from './schemas/categorized-product/create-categorized-product.schema';
import { UpdateKLoukdoCategorizedProductSchema } from './schemas/categorized-product/update-cateegorized-product.schema';
import UpdateKLoukdoCategorizedProductInput from './type-defs/categorized-product/update-categorized-product.input';
import { DeleteKLoukdoCategorizedProductSchema } from './schemas/categorized-product/delete-categorized-product.schema';
import DeleteKLoukdoCategorizedProductInput from './type-defs/categorized-product/delete-categorized-product.input';
import GetKLoukdoCategorizedProductInput from './type-defs/categorized-product/get-categorized-product.input';
import { GetKLoukdoSubCategoryByKLoukdoCategorySchema } from './schemas/sub-category/all-sub-categories-by-category.schema';
import { GetKLoukdoPromotionByCategorySchema } from './schemas/promotion/get-promotion-by-category.schema';
import { GetKLoukdoPromotionBySubCategorySchema } from './schemas/promotion/get-promotion-by-sub-category.schema';
import GetKLoukdoPromotionBySubCategoryInput from './type-defs/promotion/get-promotion-by-sub-category.input';
import { KLoukdoProductType } from './type-defs/product/kloukdo-product.type';
import { CreateKLoukdoProductSchema } from './schemas/product/create-kloukdo-product.schema';
import CreateKLoukdoProductInput from './type-defs/product/create-kloukdo-product.input';
import { UpdateKLoukdoProductSchema } from './schemas/product/update-kloukdo-product.schema';
import UpdateKLoukdoProductInput from './type-defs/product/update-kloukdo-product.input';
import { DeleteKLoukdoProductSchema } from './schemas/product/delete-kloukdo-product.schema';
import DeleteKLoukdoProductInput from './type-defs/product/delete-kloukdo-product.input';
import GetAllKLoukdoProductInput from './type-defs/product/get-all-kloukdo-product.input';
import GetKLoukdoProductByCategoryInput from './type-defs/product/get-kloukdo-product-by-category.input';
import GetKLoukdoProductBySubCategoryInput from './type-defs/product/get-kloukdo-product-by-sub-category.input';
import { GetKLoukdoSubCategoryByPageType } from './type-defs/sub-category/get-sub-category.type';
import { GetKLoukdoCategoryByPageType } from './type-defs/category/get-category-by-page.type';
import { GetKLoukdoProductByPageType } from './type-defs/product/get-kloukdo-product-by-page.type';

@Resolver()
export class KLoukdoResolver {
    constructor(
        private service: KLoukdoService
    ) {}
    /**
     * Categories
     */

    @Directive('@auth')
    @Mutation(() => KLoukdoCategoryType)
    @UsePipes(new JoiValidationPipe(CreateKLoukdoCategorySchema))
    async createKLoukdoCategory(@Args('params') params: CreateCategoryInput, @Context() ctx: any) {
        return await this.service.createCategory(params); 
    }

    @Directive('@auth')
    @Query(() => [KLoukdoCategoryType])
    async getKLoukdoCategories() {
        return await this.service.getAllCategory();
    }

    @Directive('@auth')
    @Query(() => GetKLoukdoCategoryByPageType)
    async getKLoukdoCategoriesByPage(@Args('page', { type: () => Number }) page: number, @Context() ctx: any) {
        return await this.service.getAllCategoryByPage({ page });
    }

    @Directive('@auth')
    @Mutation(() => KLoukdoCategoryType)
    @UsePipes(new JoiValidationPipe(UpdateKLoukdoCategorySchema))
    async updateKLoukdoCategory(@Args('params') params: UpdateKLoukdoCategoryInput, @Context() ctx: any) {
        return await this.service.updateCategory(params);
    }

    @Directive('@auth')
    @Mutation(() => KLoukdoCategoryType)
    @UsePipes(new JoiValidationPipe(DeleteKLoukdoCategorySchema))
    async deleteKLoukdoCategory(@Args('params') params: DeleteKLoukdoCategoryInput, @Context() ctx: any) {
        return await this.service.deleteCategory(params);
    }
    
    /**
     * Sub Categories
     */

    @Directive('@auth')
    @Mutation(() => KLoukdoSubCategoryType)
    @UsePipes(new JoiValidationPipe(CreateKLoukdoSubCategorySchema))
    async createKLoukdoSubCategory(@Args('params') params: CreateKLoukdoSubCategoryInput, @Context() ctx: any) {
        return await this.service.createSubCategory(params); 
    }

    @Directive('@auth')
    @Query(() => GetKLoukdoSubCategoryByPageType)
    async getKLoukdoSubCategoriesByPage(@Args('page', { type: () => Number }) page: number, @Context() ctx: any) {
        return await this.service.getAllSubCategoryByPage({ page });
    }

    @Directive('@auth')
    @Query(() => [KLoukdoSubCategoryType])
    async getKLoukdoSubCategories() {
        return await this.service.getAllSubCategories();
    }

    @Directive('@auth')
    @Query(() => [KLoukdoSubCategoryType])
    @UsePipes(new JoiValidationPipe(GetKLoukdoSubCategoryByKLoukdoCategorySchema))
    async getKLoukdoSubCategoriesByCategory(@Args('params') params: GetKLoukdoSubCategoryByCategoryInput, @Context() ctx: any) {
        return await this.service.getAllSubCategoryByMainCategory(params);
    }

    @Directive('@auth')
    @Mutation(() => KLoukdoSubCategoryType)
    @UsePipes(new JoiValidationPipe(UpdateKLoukdoSubCategorySchema))
    async updateKLoukdoSubCategory(@Args('params') params: UpdateKLoukdoSubCategoryInput, @Context() ctx: any) {
        return await this.service.updateSubCategory(params);
    }

    @Directive('@auth')
    @Mutation(() => KLoukdoSubCategoryType)
    @UsePipes(new JoiValidationPipe(DeleteKLoukdoSubCategorySchema))
    async deleteKLoukdoSubCategory(@Args('params') params: DeleteKLoukdoSubCategoryInput, @Context() ctx: any) {
        return await this.service.deleteSubCategory(params);
    }

    /**
     * Advertisement Image
     */
    @Directive('@auth')
    @Mutation(() => KLoukdoAdvertisementImageType)
    @UsePipes(new JoiValidationPipe(CreateKLoukdoAdsImageSchema))
    async createKLoukdoAdvertisementImage(@Args('params') params: CreateKLoukdoAdvertisementImageInput, @Context() ctx: any) {
        return await this.service.createKLoukdoAdsImage(params); 
    }

    @Directive('@auth')
    @Mutation(() => KLoukdoAdvertisementImageType)
    @UsePipes(new JoiValidationPipe(UpdateKLoukdoAdvertisementImageSchema))
    async updateKLoukdoAdvertisementImage(@Args('params') params: UpdateKLoukdoAdvertisementImageInput, @Context() ctx: any) {
        return await this.service.updateAdsImage(params);
    }

    @Directive('@auth')
    @Mutation(() => KLoukdoAdvertisementImageType)
    @UsePipes(new JoiValidationPipe(DeleteKLoukdoAdvertisementImageSchema))
    async deleteKLoukdoAdvertisementImage(@Args('params') params: DeleteKLoukdoAdvertisementImageInput, @Context() ctx: any) {
        return await this.service.deleteAdsImage(params);
    }

    @Directive('@auth')
    @Query(() => [KLoukdoAdvertisementImageType])
    async getKLoukdoAdvertisementImage() {
        return await this.service.getAds();
    }
    
    @Directive('@auth')
    @Query(() => [KLoukdoAdvertisementImageType])
    async getAllKLoukdoAdvertisementImage(@Args('page', { type: () => Number }) page: number, @Context() ctx: any) {
        return await this.service.getAllAds({ page });
    }
    
    /**
     * Promotion
     */
    
    @Directive('@auth')
    @Mutation(() => KLoukdoPromotionType)
    @UsePipes(new JoiValidationPipe(CreateKLoukdoPromotionSchema))
    async createKLoukdoPromotion(@Args('params') params: CreateKLoukdoPromotionInput, @Context() ctx: any) {
        return await this.service.createPromotion(params); 
    }

    @Directive('@auth')
    @Mutation(() => KLoukdoPromotionType)
    @UsePipes(new JoiValidationPipe(UpdateKLoukdoPromotionSchema))
    async updateKLoukdoPromotion(@Args('params') params: UpdateKLoukdoPromotionInput, @Context() ctx: any) {
        return await this.service.updatePromotion(params);
    }

    @Directive('@auth')
    @Mutation(() => KLoukdoPromotionType)
    @UsePipes(new JoiValidationPipe(DeleteKLoukdoPromotionSchema))
    async deleteKLoukdoPromotion(@Args('params') params: DeleteKLoukdoPromotionInput, @Context() ctx: any) {
        return await this.service.deletePromotion(params);
    }
    
    @Directive('@auth')
    @Query(() => [KLoukdoPromotionType])
    @UsePipes(new JoiValidationPipe(GetKLoukdoPromotionByCategorySchema))
    async getKLoukdoPromotionByCategory(@Args('params') params: GetKLoukdoPromotionByCategoryInput) {
        return await this.service.getPromotionByCategory(params);
    }
    
    @Directive('@auth')
    @Query(() => [KLoukdoPromotionType])
    @UsePipes(new JoiValidationPipe(GetKLoukdoPromotionBySubCategorySchema))
    async getKLoukdoPromotionBySubCategory(@Args('params') params: GetKLoukdoPromotionBySubCategoryInput) {
        return await this.service.getPromotionBySubCategory(params);
    }

    @Directive('@auth')
    @Query(() => [KLoukdoPromotionType])
    async getKLoukdoPromotionRandom() {
        return await this.service.getRandomPromotion();
    }

    @Directive('@auth')
    @Query(() => [KLoukdoPromotionType])
    async getAllKLoukdoPromotions(@Args('page', { type: () => Number }) page: number, @Context() ctx: any) {
        return await this.service.getAllKLoukdoPromotions({ page });
    }



    /**
     * Categorized Product
     */

    // @Directive('@auth')
    // @Mutation(() => KLoukdoCategorizedProductType)
    // @UsePipes(new JoiValidationPipe(CreateKLoukdoCategorizedProductSchema))
    // async createKLoukdoCategorizedProduct(@Args('params') params: CreateKLoukdoCategorizedProductInput, @Context() ctx: any) {
    //     return await this.service.createCategorizedProduct(params); 
    // }

    // @Directive('@auth')
    // @Mutation(() => KLoukdoCategorizedProductType)
    // @UsePipes(new JoiValidationPipe(UpdateKLoukdoCategorizedProductSchema))
    // async updateKLoukdoCategorizedProduct(@Args('params') params: UpdateKLoukdoCategorizedProductInput, @Context() ctx: any) {
    //     return await this.service.updateCategorizedProduct(params);
    // }

    // @Directive('@auth')
    // @Mutation(() => KLoukdoCategorizedProductType)
    // @UsePipes(new JoiValidationPipe(DeleteKLoukdoCategorizedProductSchema))
    // async deleteKLoukdoCategorizedProduct(@Args('params') params: DeleteKLoukdoCategorizedProductInput, @Context() ctx: any) {
    //     return await this.service.deleteCategorizedProduct(params);
    // }
    
    // @Directive('@auth')
    // @Query(() => KLoukdoCategorizedProductType)
    // async getKLoukdoCategorizedProduct(@Args('params') params: GetKLoukdoCategorizedProductInput) {
    //     return await this.service.getCategorizedProduct(params);
    // }


    /**
     * Products
     */

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => KLoukdoProductType)
    @UsePipes(new JoiValidationPipe(CreateKLoukdoProductSchema))
    async createKLoukdoProduct(@Args('params') params: CreateKLoukdoProductInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.service.createKLoukdoProduct(id, params); 
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => KLoukdoProductType)
    @UsePipes(new JoiValidationPipe(UpdateKLoukdoProductSchema))
    async updateKLoukdoProduct(@Args('params') params: UpdateKLoukdoProductInput, @Context() ctx: any) {
        return await this.service.updateKLoukdoProduct(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => KLoukdoProductType)
    @UsePipes(new JoiValidationPipe(DeleteKLoukdoProductSchema))
    async deleteKLoukdoProduct(@Args('params') params: DeleteKLoukdoProductInput, @Context() ctx: any) {
        return await this.service.deleteKLoukdoProduct(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => KLoukdoProductType)
    @UsePipes(new JoiValidationPipe(DeleteKLoukdoProductSchema))
    async getKLoukdoProduct(@Args('params') params: DeleteKLoukdoProductInput, @Context() ctx: any) {
        const { id } = params;
        return await this.service.findKLoukdoProductById(id);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => GetKLoukdoProductByPageType)
    async getAllKLoukdoProducts(@Args('params') params: GetAllKLoukdoProductInput) {
        const { page, limit } = params;
        return await this.service.getAllKLoukdoProduct({ page, limit });
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [KLoukdoProductType])
    searchKLoukdoProductByName(@Args('name', { type: () => String }) name: string) {
        return this.service.searchKLoukdoProductByName(name);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [KLoukdoProductType])
    findKLoukdoProductByCategory(@Args('params') params: GetKLoukdoProductByCategoryInput) {
        const { category, limit } = params;
        return this.service.findKLoukdoProductByCategory(category, limit);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [KLoukdoProductType])
    findKLoukdoProductBySubCategory(@Args('params') params: GetKLoukdoProductBySubCategoryInput) {
        const { subCategory, limit } = params;
        return this.service.findKLoukdoProductBySubCategory(subCategory, limit);
    }

}