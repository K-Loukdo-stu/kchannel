import { Args, Context, Directive, Mutation, Resolver, Query} from '@nestjs/graphql';
import { KLoukdoService } from './k-loukdo.service';
import { UsePipes } from '@nestjs/common';
import { Product } from '../product/models/product.model';
import { JoiValidationPipe } from '@htkradass/nestcommon';
import { CreateKLoukdoCategorySchema } from './schemas/creat-categories.schema';
import CreateCategoryInput from './type-defs/create-category.input';
import { KLoukdoCategory } from './models/category.model';
import { KLoukdoCategoryType } from './type-defs/category.type';
import { KLoukdoSubCategoryType } from './type-defs/sub-category.type';
import { CreateKLoukdoSubCategorySchema } from './schemas/create-sub-categories.schema';
import CreateKLoukdoSubCategoryInput from './type-defs/create-sub-category.input';

@Resolver()
export class KLoukdoResolver {
    constructor(
        private service: KLoukdoService
    ) {}
    /**
     * Categories
     */

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => KLoukdoCategoryType)
    @UsePipes(new JoiValidationPipe(CreateKLoukdoCategorySchema))
    async createKLoukdoCategory(@Args('params') params: CreateCategoryInput, @Context() ctx: any) {
        console.log("asd")
        return await this.service.createCategory(params); 
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [KLoukdoCategoryType])
    async getKLoukdoCategories() {
        return await this.service.getAllCategory();
    }
    
    /**
     * Sub Categories
     */

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => KLoukdoSubCategoryType)
    @UsePipes(new JoiValidationPipe(CreateKLoukdoSubCategorySchema))
    async createKLoukdoSubCategory(@Args('params') params: CreateKLoukdoSubCategoryInput, @Context() ctx: any) {
        return await this.service.createSubCategory(params); 
    }
}