import { Module } from '@nestjs/common';
import GraphQLJSON from 'graphql-type-json';
import { RedisModule } from './redis/redis.module';
import { GraphQLModule } from '@nestjs/graphql';
import { authDirectives } from '@htkradass/nestcommon';
import { join } from 'path';
import { NatsModule } from './nats/nats.module';
import { MongooseModule } from './mongoose/mongoose.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { ExtensionModule } from './extension/extension.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

export const IN_PROD = process.env.NODE_DEV !== 'development';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.register({
      uri: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/kchannel?authSource=admin`,
    }),
    NatsModule.register(),
    RedisModule.register(),
    GraphQLModule.forRoot({
      debug: !IN_PROD,
      playground: !IN_PROD,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      schemaDirectives: {
        ...authDirectives,
      },
      resolvers: {
        JSON: GraphQLJSON
      },
    }),
    UserModule,
    ChannelModule,
    ExtensionModule,
    HttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
