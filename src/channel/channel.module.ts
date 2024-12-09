import { forwardRef, Module } from '@nestjs/common';
import { ExtensionModule } from 'src/extension/extension.module';
import { NatsModule } from '../nats/nats.module';
import { ChannelCatalogService } from './channel/catalog.service';
import { ChannelResolver } from './channel/channel.resolver';
import { ChannelService } from './channel/channel.service';
import { ChannelRemarkService } from './channel/channel-remark.service';
import { HttpModule } from '@nestjs/axios';
import { FollowerRemarkFieldService } from './channel/follower-remark-field.service';
import { ChannelFollowshipService } from './channel/followship.service';

const combinedServices = [
  ChannelService,
  ChannelCatalogService,
  ChannelRemarkService,
  FollowerRemarkFieldService,
  ChannelFollowshipService,
];

@Module({
  imports: [
    forwardRef((() => ExtensionModule)),
    forwardRef((() => NatsModule.register())),
    HttpModule,
  ],
  providers: [
    ChannelResolver,
    ...combinedServices
  ],
  exports: combinedServices
})
export class ChannelModule { }
