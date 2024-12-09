import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose';

interface ProductTypeAttrs {
    id?: string;
    name: string;
    catalog?: string;
    icon?: object;
    createdBy?: string;
    channel?: string;
}

interface ProductTypeModel extends mongoose.Model<ProductTypeDoc> {
    build(attrs: ProductTypeAttrs): ProductTypeDoc;
}

interface ProductTypeDoc extends mongoose.Document {
    id?: string;
    name: string;
    catalog?: string;
    icon?: object;
    createdBy?: string;
    channel?: string;
}

const ProductTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    catalog: {
        type: SchemaTypes.ObjectId,
        ref: 'ProductTypeCatalog',
    },
    icon: { type: Object },
    createdBy: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
    },
    channel: {
        type: SchemaTypes.ObjectId,
        ref: 'Channel',
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

ProductTypeSchema.statics.build = (attrs: ProductTypeAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new ProductType({
        _id,
        ...attrs
    });
};

const ProductType = mongoose.model<ProductTypeDoc, ProductTypeModel>(
    'ProductType', ProductTypeSchema
)

export { ProductType, ProductTypeAttrs, ProductTypeDoc }