import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose'

interface OrderAtts {
    _id?: string;
    id?: string;
    channel: string;
    inProcessStatus: string; // InOrderProcessStatus
    subTotal: number,
    discount?: number,
    delivery: number,
    total: number,
    acceptingCurrency?: string;
    usdExchangeRateInRiel?: number;
    user: string;
    orderLines?: [object];
    hasCurrencyConversion?: boolean;
    inOrderAt?: Date;
    inProcessingAt?: Date;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAtts): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
    id?: string;
    channel: string;
    inProcessStatus: string;
    subTotal: number,
    discount?: number,
    delivery: number,
    total: number,
    acceptingCurrency: string;
    usdExchangeRateInRiel: number;
    orderLines?: [object];
    user: string;
    hasCurrencyConversion?: boolean;
    lastModifyAt?: Date;
}

const OrderSchema = new mongoose.Schema({
    inProcessStatus: {
        type: String,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0
    },
    delivery: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    orderLines: {
        type: [Object],
        default: []
    },
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    channel: {
        type: SchemaTypes.ObjectId,
        ref: 'Channel',
        required: true,
    },
    acceptingCurrency: {
        type: String,
    },
    usdExchangeRateInRiel: {
        type: Number,
    },
    hasCurrencyConversion: {
        type: Boolean,
    }, 
    lastModifyAt: {
        type: Date,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
}
);

OrderSchema.statics.build = (attrs: OrderAtts) => {
    const _id = attrs.id
    delete attrs.id
    return new Order({
        _id,
        ...attrs
    });
};

const Order = mongoose.model<OrderDoc, OrderModel>(
    'Order', OrderSchema
);

export { Order, OrderAtts, OrderDoc }