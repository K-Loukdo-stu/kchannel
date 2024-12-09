import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { ChannelModule } from 'src/channel/channel.module';
import { NatsService } from './nats.service';
import { UserModule } from 'src/user/user.module';

@Module({
})
export class NatsModule {
  static register(options?): DynamicModule {
    return {
      module: NatsService,
      providers: [
        NatsService,
        {
          provide: 'NATS_OPTIONS',
          useValue: {
            url: process.env.NATS_URL,
            clientId: process.env.NATS_CLIENT_ID,
            clusterId: process.env.NATS_CLUSTER_ID,
            ...options
          }
        }
      ],
      imports: [ChannelModule, UserModule],
      exports: [NatsService],
    }
  }
}
