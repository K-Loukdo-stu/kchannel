import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose'

interface KLoukdoProductAttrs {
    id?: string;
    name: string;
    category: string;
    subCategory: string;
    user: string;
    photos?: object[];
    showOnMenuBoard?: boolean;
}

interface KLoukdoProductModel extends mongoose.Model<KLoukdoProductDoc> {
    build(attrs: KLoukdoProductAttrs): KLoukdoProductDoc;
}


interface KLoukdoProductDoc extends mongoose.Document {
    id?: string;
    name: string;
    category: string;
    subCategory: string;
    user: string;
    photos?: object[];
    showOnMenuBoard?: boolean;
}

const kLoukdoProductShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: SchemaTypes.ObjectId,
        ref: 'KLoukdoCategory',
        required: true,
    },
    subCategory: {
        type: SchemaTypes.ObjectId,
        ref: 'KLoukdoSubCategory',
        required: true,
    },
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    photos: {
        type: [Object],
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