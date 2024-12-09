import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as nats from 'node-nats-streaming';
import { Stan } from 'node-nats-streaming';
import { ChannelService } from 'src/channel/channel/channel.service';
import { UserCreatedListener, UserUpdatedListener } from './events/listeners';
import { ChannelCreatedEventPublisher } from './events/publishers/channel/channel-created.publisher';
import { ChannelDeletedEventPublisher } from './events/publishers/channel/channel-deleted.publisher';
import { ChannelUpdatedEventPublisher } from './events/publishers/channel/channel-updated.publisher';
import { ChannelFollowshipCreatedListener, ChannelFollowshipDeletedListener, ChannelFollowshipUpdatedListener } from './events/listeners/channel-followship.listeners';
import { ChannelFollowshipService } from 'src/channel/channel/followship.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NatsService {
  private client: Stan;
  private callback;

  constructor(
    @Inject('NATS_OPTIONS') private options,
    @Inject(forwardRef(() => ChannelService)) private readonly channelService: ChannelService,
    @Inject(forwardRef(() => ChannelFollowshipService)) private readonly chFollowshipService: ChannelFollowshipService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService
  ) { }

  onApplicationBootstrap() {
    return // disable nats
    const { url, clientId, clusterId } = this.options
    const connectNats = (maxAttempt) => {
      if (maxAttempt <= 0)
        return;

      // this.client = nats.connect(clusterId, clientId, { url });
      // add user and password for nats 
      this.client = nats.connect(clusterId, clientId, { url, user: process.env.NATS_USER, pass: process.env.NATS_PWD });
      this.client.on('connect', () => {
        console.log('KChannel connected to NATS');
        if (this.callback) {
          this.callback(this.client)
        }

        // Listeners
        const userCreatedListener = new UserCreatedListener(this.client);
        userCreatedListener.setUserService(this.userService);
        userCreatedListener.listen();

        const userUpdatedListener = new UserUpdatedListener(this.client);
        userUpdatedListener.setUserService(this.userService);
        userUpdatedListener.listen();

        // Channel followship
        const chFollowshipCreatedListener = new ChannelFollowshipCreatedListener(this.client);
        chFollowshipCreatedListener.setChFollowshipService(this.chFollowshipService);
        chFollowshipCreatedListener.listen();

        const chFollowshipUpdatedListener = new ChannelFollowshipUpdatedListener(this.client);
        chFollowshipUpdatedListener.setChFollowshipService(this.chFollowshipService);
        chFollowshipUpdatedListener.listen();

        const chFollowshipDeletedListener = new ChannelFollowshipDeletedListener(this.client);
        chFollowshipDeletedListener.setChFollowshipService(this.chFollowshipService);
        chFollowshipDeletedListener.listen();
      });

      this.client.on('error', (err) => {
        console.warn("KChannel NatsError:", err.message ? err.message : "");
        if (err.code === 'CONN_ERR') {
          console.log('KChannel trying to reconnect Nats in 5s...');
          setTimeout(() => {
            connectNats(maxAttempt - 1);
          }, 5000)
        }
      });

      this.client.on('close', () => {
        console.log('KChannel NATS connection closed!');
      });
    }

    connectNats(5);
  }

  getClient(callback): Stan {
    this.callback = callback;

    if (!this.client) {
      console.log("Cannot access NATS client before connecting");
      return callback(null)
    }

    return callback(this.client)
  }

  publish() {
    if (!this.client) return;

    // Channel
    const ChCreated = (playload: any) => {
      const publisher = new ChannelCreatedEventPublisher(this.client);
      publisher.publish(playload)
    }

    const ChDeleted = (playload: any) => {
      const publisher = new ChannelDeletedEventPublisher(this.client);
      publisher.publish(playload)
    }

    const ChUpdated = (playload: any) => {
      const publisher = new ChannelUpdatedEventPublisher(this.client);
      publisher.publish(playload)
    }

    return {
      ChCreated,
      ChDeleted,
      ChUpdated,
    }
  }

  onModuleDestroy() {
    this.client.close()
  }
}
