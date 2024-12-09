import { JoiValidationPipe } from '@htkradass/nestcommon';
import { UsePipes } from '@nestjs/common';
import { Args, Context, Directive, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExtensionSubscriptionService } from './extension-subscription.service';
import { ExtensionService } from './extension.service';
import { ChannelReviewService } from './review.service';
import { ChannelExtensionsSchema, CreateExtensionSchema, DeleteExtensionSchema, ExtensionSchema, ExtensionsSchema, UpdateExtensionSchema } from './schemas/extension';
import { AttdExtSubscriptionByChannelIdsSchema, DeleteExtensionSubscriptionSchema, ExtensionSubscriptionSchema, RemoveExtensionSubscriptionSchema, SetExtensionOnMenuBoardSchema } from './schemas/extenson-subscription';
import { SubscribeChannelExtensionSchema } from './schemas/extenson-subscription/subscribe-channel-extension.schema';
import { CreateReviewChannelSchema, CreateReviewSchema, DeleteReviewSchema, UpdateReviewSchema } from './schemas/review';
import { ChannelExtensionsInput, CreateExtensionInput, DeleteExtensionInput, ExtensionInput, ExtensionType, ExtensionsInput, UpdateExtensionInput } from './type-defs/extension';
import { DeleteExtensionSubscriptionInput, ExtensionSubscriptionInput, ExtensionSubscriptionType, RemoveExtensionSubscriptionInput, SetExtensionOnMenuBoardInput, SubscribeChannelExtensionInput } from './type-defs/extension-subscription';
import { ChannelReviewRateType, ChannelReviewType, CreateChannelReviewInput, CreateReviewChannelInput, DeleteChannelReviewInput, UpdateChannelReviewInput } from './type-defs/review';
import { AttdExtSubscriptionByChannelIdsInput } from './type-defs/extension-subscription/attd-ext-subscription-by-ch-ids.input';

@Resolver()
export class ExtensionResolver {
    constructor(
        private extensionService: ExtensionService,
        private extensionSubscriptionService: ExtensionSubscriptionService,
        private channelReviewService: ChannelReviewService,
    ) { }

    /*
     * Extension
    */

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => ExtensionType)
    @UsePipes(new JoiValidationPipe(ExtensionSchema))
    async extension(@Args('params') params: ExtensionInput, @Context() ctx: any) {
        const id = params.id;
        return await this.extensionService.findById(id);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ExtensionType])
    @UsePipes(new JoiValidationPipe(ExtensionsSchema))
    async extensions(@Args('params') params: ExtensionsInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.extensionService.findAll(id, params.channel);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ExtensionType])
    @UsePipes(new JoiValidationPipe(ChannelExtensionsSchema))
    async channelExtensions(@Args('params') params: ChannelExtensionsInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.extensionService.findByChannel(id, params.channel);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ExtensionType)
    @UsePipes(new JoiValidationPipe(CreateExtensionSchema))
    async createExtension(@Args('params') params: CreateExtensionInput, @Context() ctx: any) {
        return await this.extensionService.create(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ExtensionType)
    @UsePipes(new JoiValidationPipe(DeleteExtensionSchema))
    async deleteExtension(@Args('params') params: DeleteExtensionInput, @Context() ctx: any) {
        return await this.extensionService.delete(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ExtensionType)
    @UsePipes(new JoiValidationPipe(UpdateExtensionSchema))
    async updateExtension(@Args('params') params: UpdateExtensionInput, @Context() ctx: any) {
        return await this.extensionService.update(params);
    }


    /*
     * ExtensionSubscription
    */

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => ExtensionSubscriptionType)
    @UsePipes(new JoiValidationPipe(ExtensionSubscriptionSchema))
    async extensionSubscription(@Args('params') params: ExtensionSubscriptionInput, @Context() ctx: any) {
        const id = params.id;
        return await this.extensionSubscriptionService.findById(id);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ExtensionSubscriptionType])
    async extensionSubscriptions() {
        return await this.extensionSubscriptionService.findAll();
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ExtensionSubscriptionType])
    @UsePipes(new JoiValidationPipe(AttdExtSubscriptionByChannelIdsSchema))
    async attdExtSubscriptions(@Args('params') params: AttdExtSubscriptionByChannelIdsInput, @Context() ctx: any) {
        return await this.extensionSubscriptionService.findAttdSubscriptionByChannelIds(ctx.req, params.pageNumber, params.limit);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ExtensionSubscriptionType)
    @UsePipes(new JoiValidationPipe(SubscribeChannelExtensionSchema))
    async subscribeChannelExtension(@Args('params') params: SubscribeChannelExtensionInput, @Context() ctx: any) {
        return await this.extensionSubscriptionService.subscribe(params.channel, params.extension);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ExtensionSubscriptionType)
    @UsePipes(new JoiValidationPipe(SubscribeChannelExtensionSchema))
    async unsubscribeChannelExtension(@Args('params') params: SubscribeChannelExtensionInput, @Context() ctx: any) {
        return await this.extensionSubscriptionService.unsubscribe(params.channel, params.extension);
    }


    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ExtensionSubscriptionType)
    @UsePipes(new JoiValidationPipe(DeleteExtensionSubscriptionSchema))
    async deleteExtensionSubscription(@Args('params') params: DeleteExtensionSubscriptionInput, @Context() ctx: any) {
        return await this.extensionSubscriptionService.delete(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ExtensionSubscriptionType)
    @UsePipes(new JoiValidationPipe(RemoveExtensionSubscriptionSchema))
    async removeExtensionSubscription(@Args('params') params: RemoveExtensionSubscriptionInput, @Context() ctx: any) {
        return await this.extensionSubscriptionService.remove(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ExtensionSubscriptionType])
    async extensionSubscriptionByChannel(@Args('channelId', { type: () => String }) channelId: string) {
        return await this.extensionSubscriptionService.findByChannel(channelId);
    }

    @Directive('@auth')
    @Query(() => ExtensionSubscriptionType)
    @UsePipes(new JoiValidationPipe(SetExtensionOnMenuBoardSchema))
    async setExtensionOnMenuBoard(@Args('params') params: SetExtensionOnMenuBoardInput) {
        const { channel, extension, isOnMenuBoard } = params;
        return await this.extensionSubscriptionService.setExtensionOnMenuBoard(channel, extension, isOnMenuBoard);
    }

    /*
   * Channel Review
   */

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ChannelReviewType])
    async channelReviews() {
        return await this.channelReviewService.findAll();
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => ChannelReviewType)
    async extensionReview(@Args('extensionId', { type: () => String }) extensionId: string, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.channelReviewService.findReviewByExtension(id, extensionId);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [ChannelReviewType])
    async channelReview(@Args('channelId', { type: () => String }) channelId: string, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.channelReviewService.findReviewByChannel(id, channelId);
    }


    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => ChannelReviewRateType)
    async channelRate(@Args('channelId', { type: () => String }) channelId: string, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.channelReviewService.rateByChannel(id, channelId);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ChannelReviewType)
    @UsePipes(new JoiValidationPipe(CreateReviewSchema))
    async createChannelReview(@Args('params') params: CreateChannelReviewInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.channelReviewService.create(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ChannelReviewType)
    @UsePipes(new JoiValidationPipe(CreateReviewChannelSchema))
    async createReviewChannel(@Args('params') params: CreateReviewChannelInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return await this.channelReviewService.createReviewChannel(id, params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ChannelReviewType)
    @UsePipes(new JoiValidationPipe(DeleteReviewSchema))
    async deleteChannelReview(@Args('params') params: DeleteChannelReviewInput, @Context() ctx: any) {
        return await this.channelReviewService.delete(params);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => ChannelReviewType)
    @UsePipes(new JoiValidationPipe(UpdateReviewSchema))
    async updateChannelReview(@Args('params') params: UpdateChannelReviewInput, @Context() ctx: any) {
        return await this.channelReviewService.update(params);
    }
}

