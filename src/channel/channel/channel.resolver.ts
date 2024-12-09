import { JoiValidationPipe } from '@htkradass/nestcommon';
import { UsePipes } from '@nestjs/common';
import { Args, Context, Directive, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChannelCatalogService } from "./catalog.service";
import { ChannelRemarkService } from './channel-remark.service';
import { ChannelService } from './channel.service';
import { ChannelCatalogsByChannelKindSchema, CreateChannelCatalogSchema, DeleteChannelCatalogSchema, UpdateChannelCatalogSchema } from "./schemas/catalog";
import { CreateChannelSchema, DeleteChannelSchema, SearchChannelsSchema, UpdateChannelAddressSchema, UpdateChannelCoverSchema, UpdateChannelCurrencyAndExchangeRateSchema, UpdateChannelInfoSchema, UpdateChannelProfileSchema, UpdateChannelSchema, ChannelsSchema } from './schemas/channel';
import { ChFollowerRemarkFieldsSchema, ChannelRemarkSchema, CreateChannelRemarkSchema, DeleteChannelRemarkSchema, SetChFollowerRemarkFieldsSchema, UpdateChannelRemarkEnableSchema, UpdateChannelRemarkRequiredSchema, UpdateChannelRemarkSchema } from './schemas/channel-remark';
import { ChannelCatalogType, CreateChannelCatalogInput, DeleteChannelCatalogInput, SearchChannelCatalogsType, UpdateChannelCatalogInput } from "./type-defs/catalog";
import { ChannelType, ChannelTypeInput, CreateChannelInput, CreateSyncChannelInput, DeleteChannelInput, SearchChannelInput, SearchChannelType, SyncAllChannelsInput, SyncChannelType, SyncChannelsType, UpdateChannelAddressInput, UpdateChannelCoverInput, UpdateChannelInfoInput, UpdateChannelInput, UpdateChannelProfileInput } from './type-defs/channel';
import { ChFollowerRemarkFieldsInput, ChannelRemarkInput, CreateChannelRemarkInput, DeleteChannelRemarkInput, SetChFollowerRemarkFieldsInput, UpdateChannelRemarkEnableInput, UpdateChannelRemarkInput, UpdateChannelRemarkRequiredInput } from './type-defs/channel-remark';
import { ChannelRemarkType } from './type-defs/channel-remark/channel-remark.type';
import UpdateChannelCurrencyAndExchangeRateInput from './type-defs/channel/update-channel-currency-and-exchange-rate.input';
import ChannelCatalogsByChannelKindInput from './type-defs/catalog/channel-catalogs-by-channel-kind.input';
import ChannelsInput from './type-defs/channel/channels.input';
import { ChannelFollowshipService } from "./followship.service";
import { ChannelFollowshipType, CreateUpdateChannelFollowshipInput, SyncAllChannelFollowshipInput, SyncChannelFollowshipType } from './type-defs/channel-followship';
import { CreateUpdateChannelFollowshipSchema } from './schemas/channel-followship';
import { CreateUpdateSynChannelSchema } from './schemas/channel/create-update-sync-channel.schema';

@Resolver()
export class ChannelResolver {
  constructor(
    private channelService: ChannelService,
    private channelCatalogService: ChannelCatalogService,
    private channelRemarkService: ChannelRemarkService,
    private channelFollowshipService: ChannelFollowshipService,
  ) { }

  /**
   * Channel
   */

  @Directive('@auth')
  @Query(() => ChannelType)
  async channel(@Args('id', { type: () => String }) id: string) {
    return await this.channelService.findById(id);
  }

  @Directive('@auth')
  @Query(() => [ChannelType])
  async latestChannel() {
    return await this.channelService.getLatest();
  }

  @Directive('@auth')
  @Query(() => [ChannelType])
  async channelById(@Args('id', { type: () => String }) id: string) {
    return await this.channelService.findChannelById(id);
  }

  @Directive('@auth')
  @Mutation(() => SyncChannelType)
  @UsePipes(new JoiValidationPipe(CreateUpdateSynChannelSchema))
  async createOrUpdateChannel(@Args('params') params: CreateSyncChannelInput, @Context() ctx: any) {
    return await this.channelService.createOrUpdate(params);
  }

  @Directive('@auth')
  @Query(() => SyncChannelsType)
  async syncAllChannels(@Args('params') params: SyncAllChannelsInput, @Context() ctx: any) {
    return await this.channelService.syncChannels(params);
  }

  @Directive('@auth')
  @Query(() => ChannelType)
  async channelInfo(@Args('id', { type: () => String }) id: string) {
    return await this.channelService.findChannelInfo({ channelId: id });
  }

  @Directive('@auth')
  @Query(() => SearchChannelType)
  @UsePipes(new JoiValidationPipe(SearchChannelsSchema))
  async searchChannels(@Args('param') param: SearchChannelInput) {
    const { searchText, currentPage, limit } = param
    const searchChannelData = await this.channelService.searchChannels(searchText, currentPage, limit)
    return searchChannelData;
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [ChannelType])
  async myChannels(@Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelService.findChannelByUser(id);
  }

  @Directive('@auth')
  @Query(() => [ChannelType])
  @UsePipes(new JoiValidationPipe(ChannelsSchema))
  async channels(@Args('params') params: ChannelsInput) {
    return await this.channelService.getAllChannels(params);
  }

  @Directive('@auth')
  @Query(() => [ChannelType])
  async channelsByProductType(@Args('params') params: ChannelTypeInput, @Context() ctx: any) {
    return await this.channelService.findByProductType(params);
  }

  @Directive('@auth')
  @Query(() => [ChannelType])
  async channelByUser(@Args('user', { type: () => String }) userId: string) {
    return await this.channelService.findChannelByUser(userId);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelType)
  @UsePipes(new JoiValidationPipe(CreateChannelSchema))
  async createChannel(@Args('params') params: CreateChannelInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelService.create(id, params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelType)
  @UsePipes(new JoiValidationPipe(UpdateChannelCurrencyAndExchangeRateSchema))
  async updateChannelCurrencyAndExchangeRate(@Args('params') params: UpdateChannelCurrencyAndExchangeRateInput, @Context() ctx: any) {
    return await this.channelService.updateChannelCurrencyAndExchangeRate(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelType)
  @UsePipes(new JoiValidationPipe(UpdateChannelSchema))
  async updateChannel(@Args('params') params: UpdateChannelInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelService.update(id, params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelType)
  @UsePipes(new JoiValidationPipe(UpdateChannelInfoSchema))
  async updateChannelInfo(@Args('params') params: UpdateChannelInfoInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelService.updateInfo(id, params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelType)
  @UsePipes(new JoiValidationPipe(UpdateChannelAddressSchema))
  async updateChannelAddress(@Args('params') params: UpdateChannelAddressInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelService.updateAddress(id, params);
  }

  @Directive('@auth')
  @Mutation(() => ChannelType)
  @UsePipes(new JoiValidationPipe(UpdateChannelProfileSchema))
  async updateChannelProfile(@Args('params') params: UpdateChannelProfileInput, @Context() ctx: any) {
    return await this.channelService.updateProfile(params);
  }

  @Directive('@auth')
  @Mutation(() => ChannelType)
  @UsePipes(new JoiValidationPipe(UpdateChannelCoverSchema))
  async updateChannelCover(@Args('params') params: UpdateChannelCoverInput, @Context() ctx: any) {
    return await this.channelService.updateCover(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelType)
  @UsePipes(new JoiValidationPipe(DeleteChannelSchema))
  async deleteChannel(@Args('params') params: DeleteChannelInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelService.deleteSoftly(id, params);
  }


  /**
  * Catalog
  */
  @Directive('@auth')
  @Query(() => ChannelCatalogType)
  async channelCatalog(@Args('id', { type: () => String }) id: string) {
    return await this.channelCatalogService.findById(id);
  }

  @Directive('@auth')
  @Query(() => [ChannelCatalogType])
  async channelCatalogs() {
    return await this.channelCatalogService.findAll();
  }

  @Directive('@auth')
  @Query(() => [ChannelCatalogType])
  @UsePipes(new JoiValidationPipe(ChannelCatalogsByChannelKindSchema))
  async channelCatalogsByChannelKind(@Args('params') params: ChannelCatalogsByChannelKindInput) {
    return await this.channelCatalogService.findByChannelKind(params.channelKind);
  }

  @Directive('@auth')
  @Query(() => SearchChannelCatalogsType)
  async searchChannelCatalogs(@Args('param') param: SearchChannelInput) {
    const { searchText, currentPage } = param
    const channelCatalogs = await this.channelCatalogService.searchChannelCatalogs(searchText, currentPage)
    return channelCatalogs;
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelCatalogType)
  @UsePipes(new JoiValidationPipe(CreateChannelCatalogSchema))
  async createChannelCatalog(@Args('params') params: CreateChannelCatalogInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelCatalogService.create(id, params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelCatalogType)
  @UsePipes(new JoiValidationPipe(DeleteChannelCatalogSchema))
  async deleteChannelCatalog(@Args('params') params: DeleteChannelCatalogInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelCatalogService.delete(id, params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelCatalogType)
  @UsePipes(new JoiValidationPipe(UpdateChannelCatalogSchema))
  async updateChannelCatalog(@Args('params') params: UpdateChannelCatalogInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelCatalogService.update(id, params);
  }

  /**
   * Channel Remark 
   */

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => ChannelRemarkType)
  @UsePipes(new JoiValidationPipe(ChannelRemarkSchema))
  async channelRemark(@Args('params') params: ChannelRemarkInput, @Context() ctx: any) {
    const id = params.id;
    return await this.channelRemarkService.findById(id)

  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [ChannelRemarkType])
  async channelRemarks() {
    return await this.channelRemarkService.findAll();
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [ChannelRemarkType])
  async channelRemarksByChannel(@Args('channelId', { type: () => String }) channelId: string, @Context() ctx: any) {
    return await this.channelRemarkService.findByChannel(channelId);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelRemarkType)
  @UsePipes(new JoiValidationPipe(CreateChannelRemarkSchema))
  async createChannelRemark(@Args('params') params: CreateChannelRemarkInput, @Context() ctx: any) {
    return await this.channelRemarkService.create(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelRemarkType)
  @UsePipes(new JoiValidationPipe(UpdateChannelRemarkSchema))
  async updateChannelRemark(@Args('params') params: UpdateChannelRemarkInput, @Context() ctx: any) {
    return await this.channelRemarkService.update(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelRemarkType)
  @UsePipes(new JoiValidationPipe(DeleteChannelRemarkSchema))
  async deleteChannelRemark(@Args('params') params: DeleteChannelRemarkInput, @Context() ctx: any) {
    return await this.channelRemarkService.delete(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelRemarkType)
  @UsePipes(new JoiValidationPipe(UpdateChannelRemarkRequiredSchema))
  async updateChannelRemarkRequired(@Args('params') params: UpdateChannelRemarkRequiredInput, @Context() ctx: any) {
    return await this.channelRemarkService.updateStatus(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => ChannelRemarkType)
  @UsePipes(new JoiValidationPipe(UpdateChannelRemarkEnableSchema))
  async updateChannelRemarkEnable(@Args('params') params: UpdateChannelRemarkEnableInput, @Context() ctx: any) {
    return await this.channelRemarkService.updateStatusEnable(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => [ChannelRemarkType])
  @UsePipes(new JoiValidationPipe(SetChFollowerRemarkFieldsSchema))
  async setChFollowerRemarkFields(@Args('params') params: SetChFollowerRemarkFieldsInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelRemarkService.setChannelRemarkFields(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [ChannelRemarkType])
  @UsePipes(new JoiValidationPipe(ChFollowerRemarkFieldsSchema))
  async chfollowerRemarks(@Args('params') params: ChFollowerRemarkFieldsInput, @Context() ctx: any) {
    const { req: { currentUser: { id } } } = ctx;
    return await this.channelRemarkService.findChannelRemarks({ channel: params.channel, follower: params.follower });
  }


  //  Channel Followship

  @Directive('@auth')
  @Query(() => [ChannelFollowshipType])
  async latestChannelFollowship() {
    return await this.channelFollowshipService.getLatest();
  }

  @Directive('@auth')
  @Query(() => [ChannelFollowshipType])
  async followshipByUser(@Args('user', { type: () => String }) userId: string) {
    return await this.channelFollowshipService.findFollowshipByUser(userId);
  }

  // @Directive('@auth')
  // @Query(() => [ChannelFollowshipType])
  // async syncAllChannelFollowship(@Args('params') params: SyncAllChannelFollowshipInput, @Context() ctx: any) {
  //   // return await this.channelFollowshipService.getLatest();
  //   return []
  // }

  @Directive('@auth')
  @Query(() => SyncChannelFollowshipType)
  async syncAllChannelFollowship(@Args('params') params: SyncAllChannelFollowshipInput, @Context() ctx: any) {
    return await this.channelFollowshipService.syncFollowship(params);
  }

  @Directive('@auth')
  @Mutation(() => ChannelFollowshipType)
  @UsePipes(new JoiValidationPipe(CreateUpdateChannelFollowshipSchema))
  async createOrUpdateChannelFollowship(@Args('params') params: CreateUpdateChannelFollowshipInput, @Context() ctx: any) {
    return await this.channelFollowshipService.createOrUpdate(params);
  }

  @Directive('@auth')
  @Query(() => [ChannelFollowshipType])
  async channelFollowship(@Args('id', { type: () => String }) id: string) {
    return await this.channelFollowshipService.findById(id);
  }

}
