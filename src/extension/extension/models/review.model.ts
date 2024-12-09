import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose';

interface ExtensionReviewAttrs {
    id?: string;
    createdBy?: string;
    extension?: string;
    channel?: string;
    feedback: string;
    rate: number;
}

interface ExtensionReviewModel extends mongoose.Model<ExtensionReviewDoc> {
    build(attrs: ExtensionReviewAttrs): ExtensionReviewDoc;
}

interface ExtensionReviewDoc extends mongoose.Document {
    id?: string;
    createdBy?: string;
    extension?: string;
    channel?: string;
    feedback: string;
    rate: number;
}

const reviewShema = new mongoose.Schema({
    createdBy: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    extension: {
        type: SchemaTypes.ObjectId,
        ref: 'Extension',
    },
    channel: {
        type: SchemaTypes.ObjectId,
        ref: 'Channel',
    },
    feedback: {
        type: String,
    },
    rate: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
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

reviewShema.statics.build = (attrs: ExtensionReviewAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new ExtensionReview({
        _id,
        ...attrs
    });
};

const ExtensionReview = mongoose.model<ExtensionReviewDoc, ExtensionReviewModel>(
    'ExtensionReview', reviewShema
);

export { ExtensionReview, ExtensionReviewAttrs, ExtensionReviewDoc };
