import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose';

interface ExtensionSubscriptionAttrs {
    id?: string;
    channel: string;
    extension: string;
    expiredAt: number;
    issuedAt: number;
    deleted: boolean;
    isOnMenuBoard?: boolean;
}

interface ExtensionSubscriptionModel extends mongoose.Model<ExtensionSubscriptionDoc> {
    build(attrs: ExtensionSubscriptionAttrs): ExtensionSubscriptionDoc;
}

interface ExtensionSubscriptionDoc extends mongoose.Document {
    id?: string;
    channel: string;
    extension: string;
    expiredAt: number;
    issuedAt: number;
    deleted: boolean;
    isOnMenuBoard?: boolean;
}

const extensionSubscriptionShema = new mongoose.Schema({
    channel: {
        type: SchemaTypes.ObjectId,
        ref: 'Channel',
        required: true
    },
    extension: {
        type: SchemaTypes.ObjectId,
        ref: 'Extension',
        required: true
    },
    expiredAt: {
        type: Date,
        required: true,
    },
    issuedAt: {
        type: Date,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true,
    },
    isOnMenuBoard: {
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

extensionSubscriptionShema.index({ extension: 1, channel: 1 }, { unique: true });

extensionSubscriptionShema.statics.build = (attrs: ExtensionSubscriptionAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new ExtensionSubscription({
        _id,
        ...attrs
    });
};

const ExtensionSubscription = mongoose.model<ExtensionSubscriptionDoc, ExtensionSubscriptionModel>(
    'ExtensionSubscription', extensionSubscriptionShema
);

export { ExtensionSubscription, ExtensionSubscriptionAttrs, ExtensionSubscriptionDoc };
