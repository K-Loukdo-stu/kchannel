import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose'

interface OrderLineAttrs {
    id?: string;
    order: string,
    product: string;
    clonedProduct: object;
    clonedBasePrice: object;
    clonedOptions: [object];
    qty: number;
    price: number;
    currency: string;
    shortDesc?: string;
    choiceKey: string;
}

interface OrderLineModel extends mongoose.Model<OrderLineDoc> {
    build(attrs: OrderLineAttrs): OrderLineDoc;
}

interface OrderLineDoc extends mongoose.Document {
    id?: string;
    order: string,
    product: string;
    clonedProduct: object;
    clonedBasePrice: object;
    clonedOptions: [object];
    qty: number;
    price: number;
    currency: string;
    shortDesc?: string;
    choiceKey: string;
}

const OrderLineShema = new mongoose.Schema({
    product: {
        type: SchemaTypes.ObjectId,
        ref: 'Product',
        required: true,
    },
    clonedProduct: {
        type: Object,
        required: true
    },
    clonedBasePrice: {
        type: Object,
        required: true
    },
    clonedOptions: [Object],
    qty: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    order: {
        type: SchemaTypes.ObjectId,
        ref: 'Order',
        required: true,
    },
    shortDesc: {
        type: String,
    },
    choiceKey: {
        type: String,
        required: true,
    },
},
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

OrderLineShema.statics.build = (attrs: OrderLineAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new OrderLine({
        _id,
        ...attrs
    });
};

const OrderLine = mongoose.model<OrderLineDoc, OrderLineModel>(
    'OrderLine', OrderLineShema
);

export { OrderLine, OrderLineAttrs, OrderLineDoc }