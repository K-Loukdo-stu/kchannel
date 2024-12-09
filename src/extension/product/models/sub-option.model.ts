import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose'

interface SubOptionAtts {
    id?: string;
    name: string;
    price: number;
    option: string;
    currency: string;
    product: string;
}

interface SubOptionModel extends mongoose.Model<SubOptionDoc> {
    build(attrs: SubOptionAtts): SubOptionDoc;
}

interface SubOptionDoc extends mongoose.Document {
    id?: string;
    name: string;
    price: number;
    option: string;
    currency: string;
    product: string;
}

const subOptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
    },
    option: {
        type: SchemaTypes.ObjectId,
        ref: 'ProductOption',
        required: true
    },
    product: {
        type: SchemaTypes.ObjectId,
        ref: 'Product',
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

subOptionSchema.statics.build = (attrs: SubOptionAtts) => {
    const _id = attrs.id
    delete attrs.id
    return new SubOption({
        _id,
        ...attrs
    });
}

const SubOption = mongoose.model<SubOptionDoc, SubOptionModel>(
    'ProductSubOption', subOptionSchema
);

export { SubOption, SubOptionAtts, SubOptionDoc }
