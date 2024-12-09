import { JoiValidationPipe } from "@htkradass/nestcommon";
import { UsePipes } from "@nestjs/common";
import { Args, Context, Directive, Mutation, Resolver, Query } from "@nestjs/graphql";
import { OptionService } from "./option.service";
import { ProductService } from "./product.service";
import { ProductTypeService } from "./product-type.service";
import { SubOptionService } from "./sub-option.service";
import { AllProductsByChannelSchema, CreateProductSchema, DeleteProductSchema, UpdateProductSchema, ProductsByChannelAndProductTypeSchema, } from "./schemas/product";
import { CreateProductTypeSchema, UpdateProductTypeSchema, DeleteProductTypeSchema, ProductTypesSchema, CreateManyProductTypesSchema, SysDefinedProductTypesSchema, } from "./schemas/product-type";
import { CreateOptionSchema, DeleteOptionSchema, UpdateOptionSchema, AllOptionsByProductSchema } from "./schemas/option";
import { CreateSubOptionSchema, DeleteSubOptionSchema, UpdateSubOptionSchema, SubOptionsByOptionSchema } from "./schemas/sub-option"
import {
    CreateProductInput, ProductType, DeleteProductInput, UpdateProductInput, ProductsByChannelAndProductTypeInput, ProductTypeInput, AllProductsByChannelInput, SearchProductType, SearchProductInput, SearchProductsInput
} from "./type-defs/product";
import { CreateProductTypeInput, ProductTypeType, UpdateProductTypeInput, DeleteProductTypeInput, ProcductTypesInput, SearchProductTypeType, SearchProductTypeInput, SearchProductTypesInput, } from "./type-defs/product-type";
import { CreateOptionInput, OptionType, DeleteOptionInput, UpdateOptionInput, AllOptionsByProductInput } from "./type-defs/option";
import { CreateSubOptionInput, SubOptionType, DeleteSubOptionInput, UpdateSubOptionInput, SubOptionsByOptionInput } from "./type-defs/sub-option";
import { AllPricesByProductInput, CreatePriceInput, DeletePriceInput, PriceType, UpdateProductPriceInput } from "./type-defs/price";
import { AllPricesByProductSchema, CreatePriceSchema, DeletePriceSchema, UpdateProductPriceSchema } from "./schemas/price";
import { PriceService } from "./price.service";
import CreateManyProductTypesInput from "./type-defs/product-type/create-many-product-types.input";
import SysDefinedProcductTypesInput from "./type-defs/product-type/sys-defined-product-types.input";
import UpdateProductShowOnBoardInput from "./type-defs/product/update-product-show-on-board.input";
import ShowOnBoardProductByChannelInput from "./type-defs/product/show-on-board-products-by-channel.input";

@Resolver()
export class ProductResolver {
    constructor(
        private productService: ProductService,
        private productTypeService: ProductTypeService,
        private optionService: OptionService,
        private subOptionService: SubOptionService,
        private priceService: PriceService
    ) { }


    /**
     * Product
     */

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => ProductType)
    @UsePipes(new JoiValidationPipe(DeleteProductSchema))
    async product(@Args('params') params: DeleteProductInput, @Context() ctx: any) {
        const { id } = params;
        return await this.productService.findById(id);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ProductType])
    async products(@Args('page', { type: () => Number }) page: number) {
        return await this.productService.getAll({ page });
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ProductType])
    async productsByProductType(@Args('params') params: ProductTypeInput, @Context() ctx: any) {
        const { productTypeId, page, limit } = params;
        return await this.productService.findByProductType({ productTypeId, page, limit });
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ProductType])
    @UsePipes(new JoiValidationPipe(ProductsByChannelAndProductTypeSchema))
    async productsByChannelAndProductType(@Args('params') params: ProductsByChannelAndProductTypeInput, @Context() ctx: any) {
        return await this.productService.findProductsByChannel(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ProductType])
    @UsePipes(new JoiValidationPipe(AllProductsByChannelSchema))
    async allProductsByChannel(@Args('params') params: AllProductsByChannelInput, @Context() ctx: any) {
        return await this.productService.findAllProductByChannel(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ProductType)
    @UsePipes(new JoiValidationPipe(CreateProductSchema))
    async createProduct(@Args('params') params: CreateProductInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.productService.create(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ProductType)
    @UsePipes(new JoiValidationPipe(UpdateProductSchema))
    async updateProduct(@Args('params') params: UpdateProductInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.productService.update(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ProductType)
    @UsePipes(new JoiValidationPipe(DeleteProductSchema))
    async deleteProduct(@Args('params') params: DeleteProductInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.productService.delete(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ProductType])
    searchProductByName(@Args('name', { type: () => String }) name: string) {
        return this.productService.searchByName(name);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => SearchProductType)
    async searchChannelProducts(@Args('param') param: SearchProductInput) {
        const { searchText, currentPage, channel, limit } = param
        const products = await this.productService.searchChannelProducts({ searchText, currentPage, channel, limit })
        return products;
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => SearchProductType)
    async searchProducts(@Args('param') param: SearchProductsInput) {
        const { searchText, currentPage } = param
        const products = await this.productService.searchProducts(searchText, currentPage)
        return products;
    }

    @Directive('@auth')
    @Mutation(() => ProductType)
    async updateProductShowOnMenuBoard(@Args('param') param: UpdateProductShowOnBoardInput) {
        const product = await this.productService.updateProductShowOnMenuBoard(param);
        return product;
    }

    @Directive('@auth')
    @Query(() => [ProductType], { nullable: true })
    async showOnMenuBoardProducts(@Args('param') param: ShowOnBoardProductByChannelInput) {
        const product = await this.productService.findShowOnMenuBoardProductsByChannel(param);
        return product;
    }


    /**
     * Product type
     */

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => ProductTypeType)
    async productType(@Args('id', { type: () => String }) id: string) {
        return await this.productTypeService.findById(id)
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ProductTypeType])
    async productTypes() {
        return await this.productTypeService.findAll(null);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ProductTypeType])
    @UsePipes(new JoiValidationPipe(SysDefinedProductTypesSchema))
    async systemDefinedProductTypes(@Args('params') params: SysDefinedProcductTypesInput) {
        return await this.productTypeService.findSystemDefined(params.catalog);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ProductTypeType])
    @UsePipes(new JoiValidationPipe(ProductTypesSchema))
    async productTypesByChannel(@Args('params') params: ProcductTypesInput) {
        return await this.productTypeService.findAll(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => SearchProductTypeType)
    async searchChannelProductTypes(@Args('param') param: SearchProductTypeInput) {
        const { searchText, currentPage, createBy } = param
        const productTypes = await this.productTypeService.searchProductTypes(searchText, currentPage, createBy)
        return productTypes;
    }


    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => SearchProductTypeType)
    async searchProductTypes(@Args('param') param: SearchProductTypesInput) {
        const { searchText, currentPage } = param
        const productTypes = await this.productTypeService.searchTypes(searchText, currentPage)
        return productTypes;
    }


    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ProductTypeType)
    @UsePipes(new JoiValidationPipe(CreateProductTypeSchema))
    async createProductType(@Args('params') params: CreateProductTypeInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.productTypeService.create(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => [ProductTypeType], { nullable: true })
    @UsePipes(new JoiValidationPipe(CreateManyProductTypesSchema))
    async createManyProductTypes(@Args('params') params: CreateManyProductTypesInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.productTypeService.createMany(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ProductTypeType)
    @UsePipes(new JoiValidationPipe(UpdateProductTypeSchema))
    async updateProductType(@Args('params') params: UpdateProductTypeInput) {
        return await this.productTypeService.update(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ProductTypeType)
    @UsePipes(new JoiValidationPipe(DeleteProductTypeSchema))
    async deleteProductType(@Args('params') params: DeleteProductTypeInput) {
        const { id } = params;
        return await this.productTypeService.delete(id);
    }

    /**
     * Product Option
     */

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => OptionType)
    @UsePipes(new JoiValidationPipe(CreateOptionSchema))
    async createProductOption(@Args('params') params: CreateOptionInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.optionService.create(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => OptionType)
    @UsePipes(new JoiValidationPipe(DeleteOptionSchema))
    async deleteProductOption(@Args('params') params: DeleteOptionInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.optionService.delete(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => OptionType)
    @UsePipes(new JoiValidationPipe(UpdateOptionSchema))
    async updateProductOption(@Args('params') params: UpdateOptionInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.optionService.update(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [OptionType])
    @UsePipes(new JoiValidationPipe(AllOptionsByProductSchema))
    async productOptionsByProduct(@Args('params') params: AllOptionsByProductInput) {
        return await this.optionService.findAllOptionsByProduct(params);
    }

    /**
     * Sub optoin
     */
    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => SubOptionType)
    @UsePipes(new JoiValidationPipe(CreateSubOptionSchema))
    async createSubOption(@Args('params') params: CreateSubOptionInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.subOptionService.create(id, params);
    }


    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => SubOptionType)
    @UsePipes(new JoiValidationPipe(DeleteSubOptionSchema))
    async deleteSubOption(@Args('params') params: DeleteSubOptionInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.subOptionService.delete(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => SubOptionType)
    @UsePipes(new JoiValidationPipe(UpdateSubOptionSchema))
    async updateSubOption(@Args('params') params: UpdateSubOptionInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.subOptionService.update(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [SubOptionType])
    @UsePipes(new JoiValidationPipe(SubOptionsByOptionSchema))
    async subOptionsByOption(@Args('params') params: SubOptionsByOptionInput, @Context() ctx: any) {
        return await this.subOptionService.findAllSubOptionsByOption(params);
    }

    /**
     * Product Price
     */

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => PriceType)
    @UsePipes(new JoiValidationPipe(CreatePriceSchema))
    async createProductPrice(@Args('params') params: CreatePriceInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.priceService.create(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => PriceType)
    @UsePipes(new JoiValidationPipe(DeletePriceSchema))
    async deleteProductPrice(@Args('params') params: DeletePriceInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.priceService.delete(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => PriceType)
    @UsePipes(new JoiValidationPipe(UpdateProductPriceSchema))
    async updateProductPrice(@Args('params') params: UpdateProductPriceInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.priceService.update(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [PriceType])
    @UsePipes(new JoiValidationPipe(AllPricesByProductSchema))
    async productPricesByProduct(@Args('params') params: AllPricesByProductInput) {
        return await this.priceService.getPrices({ productId: params.product });
    }
}