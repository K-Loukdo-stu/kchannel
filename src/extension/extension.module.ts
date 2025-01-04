import { forwardRef, Module } from '@nestjs/common';
import { ChannelModule } from 'src/channel/channel.module';
import { NatsModule } from 'src/nats/nats.module';
import { RedisModule } from 'src/redis/redis.module';
import { AttSessionMembershipService } from './card/att-session-membership.service';
import { CardMembershipService } from './card/card-membership.service';
import { CardResolver } from './card/card.resolver';
import { CardService } from './card/card.service';
import { ExtensionSubscriptionService } from './extension/extension-subscription.service';
import { ExtensionResolver } from './extension/extension.resolver';
import { ExtensionService } from './extension/extension.service';
import { ChannelReviewService } from './extension/review.service';
import { OrderLineService } from './order/order-line.service';
import { OrderResolver } from './order/order.resolver';
import { OrderService } from './order/order.service';
import { OptionService } from './product/option.service';
import { PriceService } from './product/price.service';
import { ProductTypeService } from './product/product-type.service';
import { ProductResolver } from './product/product.resolver';
import { ProductService } from './product/product.service';
import { SubOptionService } from './product/sub-option.service';
import { HttpModule } from '@nestjs/axios';
import { KLoukdoService } from './k-loukdo/k-loukdo.service';
import { KLoukdoResolver } from './k-loukdo/k-loukdo.resolver';


const combinedServices = [
  // Product
  ProductService,
  OptionService,
  SubOptionService,
  ProductTypeService,
  PriceService,

  // Order
  OrderService,
  OrderLineService,

  // Extension
  ExtensionSubscriptionService,
  ChannelReviewService,
  ExtensionService,

  // Card
  CardMembershipService,
  CardService,
  AttSessionMembershipService,

  //
  KLoukdoService
];

@Module({
  imports: [
    HttpModule,
    forwardRef((() => ChannelModule)),
    forwardRef((() => NatsModule.register())),
    forwardRef((() => RedisModule.register()))
  ],
  providers: [
    ExtensionResolver,
    CardResolver,
    ProductResolver,
    OrderResolver,
    KLoukdoResolver,
    ...combinedServices
  ],
  controllers: [

  ],
  exports: combinedServices
})
export class ExtensionModule { }
