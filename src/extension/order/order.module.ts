import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderLineService } from './order-line.service';
import { OrderResolver } from './order.resolver';

@Module({
  providers: [
    OrderService,
    OrderLineService,
    OrderResolver
  ]
})
export class OrderModule { }
