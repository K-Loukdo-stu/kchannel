import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose'

interface OptionAtts {
    id?: string;
    name: string;
    type: string;
    product: string;
}

interface OptionModel extends mongoose.Model<OptionDoc> {
    build(attrs: OptionAtts): OptionDoc;

}

interface OptionDoc extends mongoose.Document {
    id?: string;
    name: string;
    type: string;
    product: string;
}

const optionShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
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

optionShema.statics.build = (attrs: OptionAtts) => {
    const _id = attrs.id
    delete attrs.id
    return new Option({
        _id,
        ...attrs
    });
};

const Option = mongoose.model<OptionDoc, OptionModel>(
    'ProductOption', optionShema
);

export { Option, OptionAtts, OptionDoc }