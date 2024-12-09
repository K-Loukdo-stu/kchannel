import { JoiValidationPipe } from '@htkradass/nestcommon';
import { UsePipes } from '@nestjs/common';
import { Args, Context, Directive, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateSyncUserInput, SyncAllUsersInput, SyncUserType, SyncUsersType, UserType } from './typeDefs';
import { CreateUpdateSynUserSchema } from './schema';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {

  }

  @Directive('@auth')
  @Query(() => [UserType])
  async latestUser() {
    return await this.userService.getLatest();
  }

  @Directive('@auth')
  @Query(() => [UserType])
  async userById(@Args('id', { type: () => String }) id: string) {
    return await this.userService.findUserById(id);
  }

  @Directive('@auth')
  @Mutation(() => SyncUserType)
  @UsePipes(new JoiValidationPipe(CreateUpdateSynUserSchema))
  async createOrUpdateUser(@Args('userData') userData: CreateSyncUserInput, @Context() ctx: any) {
    return await this.userService.createOrUpdate(userData);
  }

  @Directive('@auth')
  @Query(() => SyncUsersType)
  async syncAllUsers(@Args('params') params: SyncAllUsersInput, @Context() ctx: any) {
    return await this.userService.syncUsers(params);
  }

}
