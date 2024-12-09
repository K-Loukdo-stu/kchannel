import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose'

interface ProductAttrs {
    id?: string;
    name: string;
    productType: string;
    channel: string;
    photo?: object;
    showOnMenuBoard?: boolean;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}


interface ProductDoc extends mongoose.Document {
    id?: string;
    name: string;
    productType: string;
    channel: string;
    photo?: object;
    showOnMenuBoard?: boolean;
}

const productShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    productType: {
        type: SchemaTypes.ObjectId,
        ref: 'ProductType',
        required: true,
    },
    channel: {
        type: SchemaTypes.ObjectId,
        ref: 'Channel',
        required: true,
    },
    photo: {
        type: Object,
    },
    showOnMenuBoard: {
        type: Boolean,
        default: false,
    },
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

productShema.statics.build = (attrs: ProductAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new Product({
        _id,
        ...attrs
    });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
    'Product', productShema
);

export { Product, ProductAttrs, ProductDoc }