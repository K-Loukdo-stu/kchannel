import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose';

interface CardMembershipAttrs {
    id?: string;
    user: string;
    card: string;
    approved: boolean;
    expiredAt: string;
    issuedAt: string;
}

interface CardMembershipModel extends mongoose.Model<CardMembershipDoc> {
    build(attrs: CardMembershipAttrs): CardMembershipDoc;
}

interface CardMembershipDoc extends mongoose.Document {
    id?: string;
    user: string;
    card: string;
    approved: boolean;
    expiredAt: string;
    issuedAt: string;
}

const cardMembershipShema = new mongoose.Schema({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    card: {
        type: SchemaTypes.ObjectId,
        ref: 'Card',
        required: true
    },
    approved: {
        type: Boolean,
        default: true,
        required: true,
    },
    expiredAt: {
        type: Date,
        required: true,
    },
    issuedAt: {
        type: Date,
        required: true,
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

cardMembershipShema.index({ 'user': 1, "card": 1 }, { unique: true });

cardMembershipShema.statics.build = (attrs: CardMembershipAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new CardMembership({
        _id,
        ...attrs
    });
};

const CardMembership = mongoose.model<CardMembershipDoc, CardMembershipModel>(
    'CardMembership', cardMembershipShema
);

export { CardMembership, CardMembershipAttrs, CardMembershipDoc };
