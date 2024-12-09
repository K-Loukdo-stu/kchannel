import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose';

interface CardAtts {
    id?: string;
    name: string;
    channel: string;
    extensionKeyname: string;
    autoApproved: boolean;
    deleted?: boolean;
    desc: string;
}

interface CardModel extends mongoose.Model<CardDoc> {
    build(attrs: CardAtts): CardDoc;
}

interface CardDoc extends mongoose.Document {
    id?: string;
    name: string;
    channel: string;
    extensionKeyname: string;
    autoApproved: boolean;
    deleted?: boolean;
    desc: string;
}

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    channel: {
        type: SchemaTypes.ObjectId,
        ref: "Channel",
        required: true
    },
    extensionKeyname: {
        type: String,
        required: true,
    },
    autoApproved: {
        type: Boolean,
        default: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
    }
}, {
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

cardSchema.statics.build = (attrs: CardAtts) => {
    const _id = attrs.id
    delete attrs.id
    return new Card({
        _id,
        ...attrs
    });
};

const Card = mongoose.model<CardDoc, CardModel>(
    'Card', cardSchema
);

export { Card, CardAtts, CardDoc };
