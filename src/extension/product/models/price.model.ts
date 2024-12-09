import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose'

interface PriceAtts {
    id?: string;
    name: string;
    price: number;
    discountPrice: number;
    hasDiscount: boolean;
    currency: string;
    product: string;
    isMain?: boolean;
}

interface PriceModel extends mongoose.Model<PriceDoc> {
    build(attrs: PriceAtts): PriceDoc;

}

interface PriceDoc extends mongoose.Document {
    id?: string;
    name: string;
    price: number;
    currency: string;
    discountPrice: number;
    hasDiscount: boolean;
    product: string;
    isMain?: boolean;
}

const priceShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    discountPrice: {
        type: Number,
        required: true,
    },

    currency: {
        type: String,
        required: true,
    },

    product: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'Product',
    },
    hasDiscount: {
        type: Boolean,
        default: false
    },
    isMain: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

priceShema.statics.build = (attrs: PriceAtts) => {
    const _id = attrs.id
    delete attrs.id
    return new Price({
        _id,
        ...attrs
    });
};


const Price = mongoose.model<PriceDoc, PriceModel>(
    'Price', priceShema
);

export { Price, PriceAtts, PriceDoc }