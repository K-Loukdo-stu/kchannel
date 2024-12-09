import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderLine, OrderLineAttrs, OrderLineDoc } from './models/order-line.model';
import { transformArrToJson } from 'src/utils';
import { CreateOrderLineInput, OrderLineInput, UpdateOrderLineQtyInput } from './type-defs/order-line';
import { ProductService } from '../product/product.service';
import { OrderUtils } from './order.utils';
import { OrderService } from './order.service';
import CreateInCartOrderInput from './type-defs/order/load-order-cart.input';
import { OrderLineByChannelInput } from './type-defs/order-line/order-line-by-channel-input.input';
import { IN_PROD } from 'src/app.module';

@Injectable()
export class OrderLineService {
    constructor(
        private orderService: OrderService,
        private productService: ProductService,
    ) { }

    async findByOrder(orderId: string, opt = { populated: true }): Promise<OrderLineDoc[]> {
        const orderLineQuery = OrderLine.find({ order: orderId });
        if (opt.populated) orderLineQuery.populate(['order']);

        const founds = await orderLineQuery;
        return transformArrToJson(founds);
    }

    async findTotalByOrder(user: string, channel: string): Promise<number> {
        try {
            const cartOrder = await this.orderService.findCartByChannelAndUser(user, channel);
            if (!cartOrder) return 0;

            const founds = await this.findByOrder(cartOrder.id);
            if (!founds) return 0;

            return founds.length;
        } catch (error) {
            return 0;
        }
    }

    async findById(id: string): Promise<OrderLineDoc> {
        const line = await OrderLine.findById(id).populate(['orderDetail', 'order']);
        return line && line.toJSON() as OrderLineDoc;
    }

    /**
     * This func is to check if the created order line is still available for a product
     */
    async findInvalidOrderLines(orderLineId: string): Promise<[object?]> {
        let invalidOrderLines: [object?] = [];

        const orderLines = await this.findByOrder(orderLineId);
        const productIds = orderLines.map(ol => ol.product.toString());
        const fullSetProducts = await this.productService.findFullSetProductsByIds(productIds);
        for (let i = 0; i < orderLines.length; i++) {
            const orderLine = orderLines[i];

            const orderLineChoiceKey = OrderUtils.generateOrderLineChoiceKey(orderLine["product"], orderLine["clonedBasePrice"], orderLine["clonedOptions"], { hasQty: false });
            const foundFullSetProductIndex = fullSetProducts.findIndex(fsp => fsp['id'].toString() == orderLine.product.toString());
            if (foundFullSetProductIndex < 0) {
                invalidOrderLines.push(orderLine);
                continue;
            }
            
            const fullSetProduct = fullSetProducts[foundFullSetProductIndex];
            const fullSetProductKey = OrderUtils.generateFullSetProductChoiceKey(fullSetProduct['id'].toString(), fullSetProduct['prices'], fullSetProduct['options']);
            const isAvailable = OrderUtils.isAnOrderLineAvailable(orderLineChoiceKey, fullSetProductKey);
            if (!isAvailable) {
                invalidOrderLines.push(orderLine);
                continue;
            }
        }

        return invalidOrderLines;
    }

    async createByChannelId(userId: string, channelId: string, orderLine: OrderLineByChannelInput) {
        const cartOrderParams: CreateInCartOrderInput = { channel: channelId };
        const cartOrder = await this.orderService.loadOrderCart(userId, cartOrderParams);

        const orderLineParam: CreateOrderLineInput = {
            ...orderLine,
            order: cartOrder.id
        }

        return await this.create(orderLineParam);
    }

    async create(newOrderLineParam: CreateOrderLineInput) {
        const { product, order, clonedOptions, clonedBasePrice } = newOrderLineParam;

        // check if duplicated product (increasing qty or adding new item)
        const existingOrderlines: OrderLineDoc[] = await OrderLine.find({ product, order });
        if (existingOrderlines?.length > 0) {
            let duplicatedOrderLine: OrderLineDoc = null;
            for (let i = 0; i < existingOrderlines.length; i++) {
                const orderLine = existingOrderlines[i];
                if (OrderUtils.compareOrderLineWithChoiceKey({
                    productId: product,
                    basePrice: clonedBasePrice,
                    options: clonedOptions
                }, orderLine.choiceKey)) {
                    duplicatedOrderLine = orderLine;
                    break;
                }
            }

            if (duplicatedOrderLine != null) {
                const newQty = newOrderLineParam['qty'] + duplicatedOrderLine.qty;
                const updated = await OrderLine.findByIdAndUpdate(duplicatedOrderLine.id, { qty: newQty }, { new: true }).populate(['order']);
                return updated.toJSON();
            }
        }

        try {
            const newOrderLine: OrderLineAttrs = {
                ...newOrderLineParam,
                choiceKey: OrderUtils.generateOrderLineChoiceKey(product, clonedBasePrice, clonedOptions),
                shortDesc: OrderUtils.generateOrderLineOptionShortDesc(product, clonedBasePrice, clonedOptions),
            }

            const created = (await (OrderLine.build(newOrderLine)).save());
            const createdFound = await OrderLine.findById(created.id).populate(['order']);
            return createdFound.toJSON();
        } catch (error) {
            if (!IN_PROD) console.log(error);
            throw new BadRequestException("Failed to create an orderline");
        }
    }

    async updateQty(param: UpdateOrderLineQtyInput) {
        const { id, quantity } = param;
        const line = await OrderLine.findById(id);
        if (!line) throw new NotFoundException('Order line is not found');

        line['qty'] = quantity;
        await line.save();

        const found = await OrderLine.findById(line.id).populate(['order']);
        return found.toJSON();
    }

    async delete(id: string) {
        const line = await OrderLine.findById(id).populate(['order']);
        if (!line) throw new NotFoundException('Order line is not found')

        await OrderLine.findByIdAndDelete(line.id);

        return line && line.toJSON();
    }
}
