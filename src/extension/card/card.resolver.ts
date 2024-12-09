import { JoiValidationPipe } from '@htkradass/nestcommon';
import { UsePipes } from '@nestjs/common';
import { Args, Context, Directive, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AttSessionMembershipService } from './att-session-membership.service';
import { CardMembershipService } from './card-membership.service';
import { CardService } from './card.service';
import { CardSchema, CardsByChannelAndExtensionSchema, CreateCardSchema, DeleteCardSchema, UpdateCardSchema, UpdateCardStatusSchema } from './schemas/card';
import {
  ApproveCardMembershipSchema,
  CardMembershipSchema,
  CardMembershipsByCardSchema,
  CreateCardMembershipSchema,
  DeleteCardMembershipSchema,
  ExportCardMembershipSchema,
  ExportChannelCardMembershipSchema,
  UpdateCardMembershipSchema,
  UpdateManyCardMembershipSchema
} from './schemas/card-membership';
import { DeleteManyCardMembershipsSchema } from './schemas/card-membership/delete-many-card-membership.schema';
import { CardInput, CardType, CardsByChannelAndExtensionInput, CreateCardInput, DeleteCardInput, UpdateCardInput, UpdateCardStatusInput } from './type-defs/card';
import { ApproveCardMembershipInput, CardMembershipAttdSessionType, CardMembershipByCardType, CardMembershipType, CardMembershipWithAttInput, CardMembershipsByCardInput, CreateCardMembershipInput, DeleteCardMembershipInput, DeleteManyCardMembershipInput, ExportCardMembershipWithAttInput, ExportChannelCardMembershipWithAttInput, UpdateCardMembershipInput, UpdateManyCardMembershipsInput } from './type-defs/card-membership';

@Resolver()
export class CardResolver {
  constructor(
    private cardMembershipService: CardMembershipService,
    private cardService: CardService,
    private attSessionMembershipService: AttSessionMembershipService,
  ) { }

  /*
    * Card
   */
  
  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => CardType)
  @UsePipes(new JoiValidationPipe(CardSchema))
  async card(@Args('params') params: CardInput, @Context() ctx: any) {
    const id = params.id;
    return await this.cardService.findById(id);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [CardType])
  async cards() {
    return await this.cardService.findAll();
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [CardType])
  @UsePipes(new JoiValidationPipe(CardsByChannelAndExtensionSchema))
  async cardsByChannelAndExtension(@Args('params') params: CardsByChannelAndExtensionInput, @Context() ctx: any) {
    return await this.cardService.findByChannelAndExtension(params.channelId, params.extensionKeyname);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => CardType)
  @UsePipes(new JoiValidationPipe(CreateCardSchema))
  async createCard(@Args('params') params: CreateCardInput, @Context() ctx: any) {
    return await this.cardService.create(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => CardType)
  @UsePipes(new JoiValidationPipe(DeleteCardSchema))
  async deleteCard(@Args('params') params: DeleteCardInput, @Context() ctx: any) {
    return await this.cardService.delete(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => CardType)
  @UsePipes(new JoiValidationPipe(UpdateCardSchema))
  async updateCard(@Args('params') params: UpdateCardInput, @Context() ctx: any) {
    return await this.cardService.update(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => CardType)
  @UsePipes(new JoiValidationPipe(UpdateCardStatusSchema))
  async updateCardStatus(@Args('params') params: UpdateCardStatusInput, @Context() ctx: any) {
    return await this.cardService.updateStatus(params);
  }

  /*
   * CardMembership
  */

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => CardMembershipType)
  @UsePipes(new JoiValidationPipe(DeleteCardMembershipSchema))
  async cardMembership(@Args('params') params: DeleteCardMembershipInput, @Context() ctx: any) {
    const id = params.id;
    return await this.cardMembershipService.findById(id);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [CardMembershipType])
  async cardMemberships() {
    return await this.cardMembershipService.findAll();
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => CardMembershipType)
  @UsePipes(new JoiValidationPipe(ApproveCardMembershipSchema))
  async approveMembership(@Args('params') params: ApproveCardMembershipInput, @Context() ctx: any) {
    return await this.cardMembershipService.approve(params.user, params.card);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => CardMembershipType)
  @UsePipes(new JoiValidationPipe(ApproveCardMembershipSchema))
  async rejectMembership(@Args('params') params: ApproveCardMembershipInput, @Context() ctx: any) {
    return await this.cardMembershipService.reject(params.user, params.card);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => [CardMembershipType])
  @UsePipes(new JoiValidationPipe(CreateCardMembershipSchema))
  async createManyCardMemberships(@Args('params') params: CreateCardMembershipInput, @Context() ctx: any) {
    return await this.cardMembershipService.createMany(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => [CardMembershipType])
  @UsePipes(new JoiValidationPipe(UpdateManyCardMembershipSchema))
  async updateManyCardMemberships(@Args('params') params: UpdateManyCardMembershipsInput, @Context() ctx: any) {
    return await this.cardMembershipService.updateMany({ users: params.users, card: params.card });
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => CardMembershipByCardType)
  @UsePipes(new JoiValidationPipe(CardMembershipsByCardSchema))
  async cardMembershipsByCard(@Args('params') params: CardMembershipsByCardInput, @Context() ctx: any) {
    return await this.cardMembershipService.findByCard(params.card, params.page, params.filter, params.sortBy);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => CardMembershipType)
  @UsePipes(new JoiValidationPipe(DeleteCardMembershipSchema))
  async deleteCardMembership(@Args('params') params: DeleteCardMembershipInput, @Context() ctx: any) {
    return await this.cardMembershipService.delete(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => [CardMembershipType])
  @UsePipes(new JoiValidationPipe(DeleteManyCardMembershipsSchema))
  async deleteManyCardMemberships(@Args('params') params: DeleteManyCardMembershipInput, @Context() ctx: any) {
    return await this.cardMembershipService.deleteMany(params);
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Mutation(() => CardMembershipType)
  @UsePipes(new JoiValidationPipe(UpdateCardMembershipSchema))
  async updateCardMembership(@Args('params') params: UpdateCardMembershipInput, @Context() ctx: any) {
    return await this.cardMembershipService.update(params);
  }

  /**
   * Attendance Session Membership
   */

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [CardMembershipType])
  @UsePipes(new JoiValidationPipe(CardMembershipSchema))
  async membershipsByCardAndAttSession(@Args('params') params: CardMembershipWithAttInput, @Context() ctx: any) {
    return await this.attSessionMembershipService.findMembershipByCardAndAttSession(params.card, params.attSess, params.page, params.filter, params.status)
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [CardMembershipType])
  @UsePipes(new JoiValidationPipe(ExportCardMembershipSchema))
  async exportAttdMembershipsByAttdSession(@Args('params') params: ExportCardMembershipWithAttInput, @Context() ctx: any) {
    return await this.attSessionMembershipService.exportMembershipByAttSession(params.card, params.attSess)
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [CardMembershipType])
  @UsePipes(new JoiValidationPipe(ExportChannelCardMembershipSchema))
  async exportAttdMembershipsByChannelAndCard(@Args('params') params: ExportChannelCardMembershipWithAttInput, @Context() ctx: any) {
    return await this.attSessionMembershipService.exportMembershipByCard(params.card, params.channel)
  }

  @Directive('@auth')
  @Directive('@currentUser')
  @Query(() => [CardMembershipAttdSessionType])
  @UsePipes(new JoiValidationPipe(ExportChannelCardMembershipSchema))
  async getAttdByChannelAndCard(@Args('params') params: ExportChannelCardMembershipWithAttInput, @Context() ctx: any) {
    return await this.attSessionMembershipService.findAttdByCardAndAttdSession(params.card, params.channel)
  }
}





