import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose'

interface KLoukdoProductAttrs {
    id?: string;
    name: string;
    icon: Object;
    description: string;
    category: number;
    subcategory: number;
    price: number;
    condition: string;
}

interface KLoukdoProductModel extends mongoose.Model<KLoukdoProductDoc> {
    build(attrs: KLoukdoProductAttrs): KLoukdoProductDoc;
}


interface KLoukdoProductDoc extends mongoose.Document {
    id?: string;
    name: string;
    icon: Object;
    description: string;
    category: number;
    subcategory: number;
    price: number;
    condition: string;
}

const kLoukdoProductShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: Object,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Number,
        ref: "Category",
        required: true
    },
    subcategory: {
        type: Number,
        ref: "SubCategory",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    condition: {
        type: String,
        required: true,
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

kLoukdoProductShema.statics.build = (attrs: KLoukdoProductAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new KLoukdoProduct({
        _id,
        ...attrs
    });
};

const KLoukdoProduct = mongoose.model<KLoukdoProductDoc, KLoukdoProductModel>(
    'KLoukdoProduct', kLoukdoProductShema
);

export { KLoukdoProduct, KLoukdoProductAttrs, KLoukdoProductDoc }