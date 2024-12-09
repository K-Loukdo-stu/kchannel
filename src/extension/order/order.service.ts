import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Order, OrderAtts, OrderDoc } from './models/order.model';
import CreateInCartOrderInput from './type-defs/order/load-order-cart.input';
import { InOrderProcessStatus, OrderUtils } from './order.utils';
import { transformArrToJson } from 'src/utils';
import { OrderLineService } from './order-line.service';
import { ChannelService } from 'src/channel/channel/channel.service';
import CheckoutACartInput from './type-defs/order/checkout-a-cart.input';
import { IN_PROD } from 'src/app.module';
var mongoose = require('mongoose')
@Injectable()
export class OrderService {
    constructor(
        @Inject(forwardRef(() => OrderLineService)) private orderLineService: OrderLineService,
        @Inject(forwardRef(() => ChannelService)) private channelService: ChannelService,
    ) { }

    async findAll(): Promise<OrderDoc[]> {
        const founds = await Order.find().populate(['user', 'channel']);
        return transformArrToJson(founds);
    }

    async findOneByFilter(filter: Partial<OrderAtts>) {
        const order = await Order.findOne(filter).populate(['user', 'channel']);
        if (!order) throw new BadRequestException("The order is not found");

        const channel = await this.channelService.findById(order.channel);
        if (!channel) throw new BadRequestException("Channel is not found");

        const orderObj: any = {
            ...order.toJSON(),
            acceptingCurrency: channel.acceptingCurrency,
            usdExchangeRateInRiel: channel.usdExchangeRateInRiel
        }

        return orderObj;
    }

    async findById(id: string) {
        const order = await this.findOneByFilter({ _id: id });
        return order;
    }

    async findByChannelAndUser(channel: string, user: string) {
        const order = await this.findOneByFilter({ channel, user });
        return order;
    }

    async findCartByChannelAndUser(user: string, channel: string) {
        const order = await this.findOneByFilter({ channel, user, inProcessStatus: InOrderProcessStatus.IN_CART });
        if (!order) return null;

        return order;
    }

    async ordersByUser(user: string) {
        // get orders group by channel
        const orders = await Order.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ["$user", mongoose.Types.ObjectId(user)] },
                            { $eq: ["$inProcessStatus", InOrderProcessStatus.IN_CART] },
                        ]
                    }
                },
            },
            { $sort: { _id: -1 } },
            {
                $group: {
                    _id: '$channel',
                    id: { $first: '$_id' },
                    channel: { $first: '$channel' },
                    inProcessStatus: { $first: '$inProcessStatus' },
                    subTotal: { $first: '$subTotal' },
                    discount: { $first: '$discount' },
                    delivery: { $first: '$delivery' },
                    total: { $first: '$total' },
                    acceptingCurrency: { $first: '$acceptingCurrency' },
                    usdExchangeRateInRiel: { $first: '$usdExchangeRateInRiel' },
                    user: { $first: '$user' },
                    hasCurrencyConversion: { $first: '$hasCurrencyConversion' },
                    orderLines: { $first: '$orderLines' },
                }
            },

            {
                $lookup: {
                    from: 'orderlines',
                    let: { order_id: '$id' },
                    as: 'orderLines',
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$order", "$$order_id"]
                                }
                            }
                        },
                        {
                            $project: {
                                id: '$_id',
                                product: 1,
                                qty: 1,
                                price: 1,
                                currency: 1,
                                choiceKey: 1,
                                shortDesc: 1
                            }
                        }
                    ]
                }
            },
            {
                $match: {
                    $expr: {
                        $gt: [{ $size: "$orderLines" }, 0]
                    }
                },
            },
            {
                $lookup: {
                    from: 'channels',
                    let: { channel_id: '$channel' },
                    as: 'channel',
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$channel_id"]
                                }
                            },
                        },
                        {
                            $project: {
                                id: `$_id`,
                                _id: 1,
                                name: 1,
                                profile: 1,
                                kind: 1,
                                acceptingCurrency: 1,
                                usdExchangeRateInRiel: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { user_id: '$user' },
                    as: 'user',
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$user_id"]
                                }
                            },

                        },
                        {
                            $project: {
                                id: '$_id',
                                username: 1,
                                firstName: 1,
                                lastName: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: '$channel' },
            { $unwind: '$user' },

            { $sort: { _id: -1 } }
        ]);

        return orders;
    }

    async loadOrderCart(userId: string, inCartOrderParam: CreateInCartOrderInput): Promise<OrderAtts> {
        const { channel } = inCartOrderParam;
        let existing = null;
        try {
            existing = await this.findOneByFilter({ user: userId, channel, inProcessStatus: InOrderProcessStatus.IN_CART });
        } catch (_) { existing = null; }

        if (!!existing) {
            // Load existing orderlines
            const orderLines = await this.orderLineService.findByOrder(existing.id, { populated: false });

            const order = {
                ...existing,
                orderLines
            }

            return order;
        }

        try {
            const newInCartOrder: OrderAtts = {
                ...inCartOrderParam,
                inProcessStatus: InOrderProcessStatus.IN_CART,
                user: userId,
                subTotal: 0,
                discount: 0,
                delivery: 0,
                total: 0,
            }

            const created = (await (Order.build(newInCartOrder)).save());
            const createdFound = await this.findOneByFilter({ _id: created.id })
            return createdFound;
        } catch (error) {
            console.log(error);
            throw new BadRequestException("Failed to create an in-cart order");
        }
    }

    async findOrderSummary(userId: string, orderLineId: string) {
        const order = await Order.findOne({ _id: orderLineId, user: userId }).populate(['user', 'channel']);
        if (!order || order['inProcessStatus'] != InOrderProcessStatus.IN_ORDER) throw new BadRequestException("The order is not found");
        return order;
    }

    async checkoutAnOrderFromCart(userId: string, params: CheckoutACartInput) {
        const existing = await Order.findById(params.orderId);
        if (!existing) throw new BadRequestException("In-cart order is not found");

        if (existing.inProcessStatus == InOrderProcessStatus.IN_ORDER)
            throw new BadRequestException("This cart is already checked out");

        try {
            const invalidOrderLines = await this.orderLineService.findInvalidOrderLines(existing.id);
            if (invalidOrderLines?.length > 0) {
                throw new BadRequestException("This order contains unavailable product/product option");
            }
        } catch (error) {
            if (!IN_PROD) console.log(error);
            throw new BadRequestException("This order contains unavailable product/product option");
        }


        const orderLines = await this.orderLineService.findByOrder(existing.id, { populated: false });
        if (orderLines.length <= 0) throw new BadRequestException("The cart is empty")
        const summerizedOrderLines = OrderUtils.tranformOrderLinesToSummerizedOrderLines(orderLines);

        try {
            const updated = await Order.findByIdAndUpdate(existing.id,
                {
                    inProcessStatus: InOrderProcessStatus.IN_ORDER,
                    subTotal: params.subTotal,
                    discount: params.discount,
                    delivery: params.delivery,
                    total: params.total,
                    acceptingCurrency: params.acceptingCurrency,
                    usdExchangeRateInRiel: params.usdExchangeRateInRiel,
                    orderLines: summerizedOrderLines,
                    hasCurrencyConversion: params.hasCurrencyConversion,
                    lastModifyAt: new Date()
                }, { new: true }).populate(['user', 'channel']);
            return updated.toJSON();
        } catch (error) {
            throw new BadRequestException("Failed to update an in-cart order to an order");
        }
    }

    async create(newDetail): Promise<OrderDoc> {
        const created = (await (Order.build(newDetail)).save());
        return created;
    }

    async update(id: string, attrs: Partial<OrderDoc>) {
        const order = await Order.findById(id);
        if (!order) {
            throw new NotFoundException('Do not have order for update !!!')
        }
        Object.assign(order, attrs);
        const updated = ((await order.save()).toJSON()) as OrderDoc;
        return updated;
    }

    async updateStatus(id: string, status: string) {
        const order = await Order.findById(id);
        if (!order) {
            throw new NotFoundException('Do not have order for update !!!')
        }
        if (!this.isStatusValid(status)) {
            throw new NotFoundException('Do not hasve status for update !!!')
        }
        order.lastModifyAt = new Date();
        order.inProcessStatus = status;
        const updated = ((await order.save()).toJSON()) as OrderDoc;
        return updated;
    }

    private isStatusValid(status: any) {
        const enumValues = Object.values(InOrderProcessStatus);
        return enumValues.includes(status);
    }

    async delete(id: string) {
        const order = await Order.findById(id);
        if (!order) {
            throw new NotFoundException('Do not have order for delete !!!')
        }
        const deleted = await Order.findByIdAndDelete(id)
        return deleted && deleted.toJSON();
    }

    async findByChannelAndStatus(channel: string, inProcessStatus: string) {
        const order = await this.findAllByFilter({ channel, inProcessStatus });
        return order;
    }

    async findAllByFilter(filter: Partial<OrderAtts>) {
        const order = await Order.find(filter).limit(2).populate(['user', 'channel']);
        if (!order) throw new BadRequestException("The order is not found");

        const channel = await this.channelService.findById(order[0].channel);
        if (!channel) throw new BadRequestException("Channel is not found");

        const ordersObj: any[] = [];
        order.forEach((ord) => {

            const orderLines = this.orderLineService.findByOrder(ord.id, { populated: false });

            const orderObj: any = {
                ...ord.toJSON(),
                orderLines,
                acceptingCurrency: channel.acceptingCurrency,
                usdExchangeRateInRiel: channel.usdExchangeRateInRiel
            }
            ordersObj.push(orderObj);

        })

        return ordersObj;
    }

    async findAllByFilterAndMoreInfo(channel: string, inProcessStatus: string) {

        const order = await Order.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ["$channel", mongoose.Types.ObjectId(channel)] },
                            { $eq: ["$inProcessStatus", inProcessStatus] },
                        ]
                    }
                },
            },
            { $sort: { lastModifyAt: -1 } },
            { $limit: 4 },
            {
                $lookup: {
                    from: 'users',
                    let: { user_id: '$user' },
                    as: 'user',
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$user_id"]
                            }
                        }
                    }, {
                        $project: {
                            id: '$_id',
                            firstName: 1,
                            lastName: 1
                        }
                    }],
                }
            },
            {
                $lookup: {
                    from: 'orderlines',
                    localField: 'orderLines.id',
                    foreignField: '_id',
                    as: 'orderLinesData',

                }
            },
            {
                $addFields: {
                    id: '$_id',
                    user: { $arrayElemAt: ['$user', 0] },
                    channel: { id: '$channel' },
                    orderLines: {
                        $map: {
                            input: '$orderLinesData',
                            as: 'orderLine',
                            in: {
                                $mergeObjects: [
                                    '$$orderLine',
                                    { id: '$$orderLine._id' }
                                ]
                            }
                        }
                    }
                }
            },
        ]);
        return order;
    }

}
