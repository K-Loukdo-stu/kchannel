import { Resolver, Query, Args, Mutation, Context, Directive } from '@nestjs/graphql';
import { JoiValidationPipe } from '@htkradass/nestcommon';
import { Param, UsePipes } from '@nestjs/common';
import { OrderInput, OrderType, UpdateOrderInput } from './type-defs/order';
import { CreateOrderLineInput, OrderLineInput, OrderLineTotalInput, OrderLineType, OrderLinesInput, UpdateOrderLineQtyInput } from './type-defs/order-line';
import { CheckoutACartSchema, LoadOrderCartSchema, OrderSchema, OrderSummarySchema, UpdateOrderSchema } from './schemas/order';
import { OrderService } from './order.service';
import { OrderLineService } from './order-line.service';
import { CreateOrderLineSchema, OrderLineTotalSchema, OrderLinesSchema, UpdateOrderLineQtySchema } from './schemas/order-line';
import LoadOrderCartInput from './type-defs/order/load-order-cart.input';
import { CreateOrderLineByChannelSchema } from './schemas/order-line/create-order-line-by-channel.schema';
import { CreateOrderLineByChannelInput } from './type-defs/order-line/create-order-line-by-channel.input';
import { query } from 'express';
import CheckoutACartInput from './type-defs/order/checkout-a-cart.input';
import OrderSummaryInput from './type-defs/order/order-summary.input';
import OrderingInput from './type-defs/order/ordering.input';
import { OrderingSchema } from './schemas/order/ordering.schema';
import { UpdateStatusSchema } from './schemas/order/update-status.schema';
import UpdateStatusInput from './type-defs/order/update-status.input';

@Resolver()
export class OrderResolver {
    constructor(
        private orderService: OrderService,
        private orderLineService: OrderLineService,
    ) { }

    /**
     * Order
     */

    @Directive('@auth')
    @Query(() => [OrderType])
    orders() {
        return this.orderService.findAll();
    }

    @Directive('@auth')
    @Query(() => OrderType)
    @UsePipes(new JoiValidationPipe(OrderSchema))
    order(@Args('param') param: OrderInput) {
        const { id } = param
        return this.orderService.findById(id);
    }

    @Directive('@auth')
    @Query(() => OrderType)
    @UsePipes(new JoiValidationPipe(OrderSchema))
    orderByChannel(@Args('param') param: OrderInput) {
        const { id } = param
        return this.orderService.findById(id);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [OrderType])
    myOrders(@Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        return this.orderService.ordersByUser(id);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => OrderType)
    @UsePipes(new JoiValidationPipe(LoadOrderCartSchema))
    loadOrderCart(@Args('params') params: LoadOrderCartInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        const created = this.orderService.loadOrderCart(id, params)
        return created;
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => OrderType)
    @UsePipes(new JoiValidationPipe(CheckoutACartSchema))
    checkoutCart(@Args('params') params: CheckoutACartInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        const created = this.orderService.checkoutAnOrderFromCart(id, params)
        return created;
    }

    @Directive('@auth')
    @Mutation(() => OrderType)
    @UsePipes(new JoiValidationPipe(UpdateOrderSchema))
    async updateOrder(@Args('params') params: UpdateOrderInput, @Context() ctx: any) {
        const { id } = params;
        return this.orderService.update(id, params)
    }

    @Directive('@auth')
    @Mutation(() => OrderType)
    @UsePipes(new JoiValidationPipe(OrderSchema))
    deleteOrder(@Args('param') param: OrderInput) {
        const { id } = param
        return this.orderService.delete(id)
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => OrderType)
    @UsePipes(new JoiValidationPipe(OrderSummarySchema))
    orderSummary(@Args('param') param: OrderSummaryInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        const { orderId } = param;
        return this.orderService.findOrderSummary(id, orderId);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [OrderType])
    @UsePipes(new JoiValidationPipe(OrderingSchema))
    listOrderingSummary(@Args('param') param: OrderingInput, @Context() ctx: any) {
        const { inProcessStatus, channel } = param;
        return this.orderService.findAllByFilterAndMoreInfo(channel, inProcessStatus);
    }

    @Directive('@auth')
    @Mutation(() => OrderType)
    @UsePipes(new JoiValidationPipe(UpdateStatusSchema))
    async updateStatusOrder(@Args('params') params: UpdateStatusInput, @Context() ctx: any) {
        const { id, status } = params;
        return this.orderService.updateStatus(id, status);
    }


    /**
     * Order Line
     */

    @Directive('@auth')
    @Query(() => [OrderLineType])
    @UsePipes(new JoiValidationPipe(OrderLinesSchema))
    orderLines(@Args('param') param: OrderLinesInput) {
        const { orderId } = param
        return this.orderLineService.findByOrder(orderId);
    }

    @Directive('@auth')
    @Mutation(() => OrderLineType)
    @UsePipes(new JoiValidationPipe(CreateOrderLineSchema))
    createOrderLine(@Args('params') params: CreateOrderLineInput, @Context() ctx: any) {
        const created = this.orderLineService.create(params)
        return created;
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Mutation(() => OrderLineType)
    @UsePipes(new JoiValidationPipe(CreateOrderLineByChannelSchema))
    createOrderLineByChannel(@Args('params') params: CreateOrderLineByChannelInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        const created = this.orderLineService.createByChannelId(id, params.channel, params.orderLine)
        return created;
    }

    @Directive('@auth')
    @Mutation(() => OrderLineType)
    @UsePipes(new JoiValidationPipe(UpdateOrderLineQtySchema))
    async updateOrderLineQuantity(@Args('params') params: UpdateOrderLineQtyInput, @Context() ctx: any) {
        return this.orderLineService.updateQty(params)
    }

    @Directive('@auth')
    @Mutation(() => OrderLineType)
    @UsePipes(new JoiValidationPipe(OrderSchema))
    deleteOrderLine(@Args('params') params: OrderLineInput) {
        const { id } = params
        return this.orderLineService.delete(id)
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => Number)
    @UsePipes(new JoiValidationPipe(OrderLineTotalSchema))
    orderLineTotal(@Args('param') param: OrderLineTotalInput, @Context() ctx: any) {
        const { req: { currentUser: { id } } } = ctx;
        const { channel } = param
        return this.orderLineService.findTotalByOrder(id, channel);
    }

    @Directive('@auth')
    @Directive('@currentUser')
    @Query(() => [OrderLineType])
    @UsePipes(new JoiValidationPipe(OrderLinesSchema))
    unavailableOrderLineByOrder(@Args('params') params: OrderLinesInput) {
        const invalidOrderLines = this.orderLineService.findInvalidOrderLines(params.orderId)
        return invalidOrderLines;
    }
}
