import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose'
interface ChannelAttrs {
    _id?: string;
    id?: string;
    name: string;
    desc?: string;
    phone?: string;
    email?: string;
    website?: string;
    bio?: string;
    profile?: object;
    cover?: object;
    catalog?: string;
    kind: string;
    createdBy: string;
    acceptingCurrency: string;
    usdExchangeRateInRiel: number;
    deleted?: boolean;
    public?: boolean;
    address?: string;
    latitude?: number;
    longitude?: number;

}

interface ChannelModel extends mongoose.Model<ChannelDoc> {
    build(attrs: ChannelAttrs): ChannelDoc;
}

interface ChannelDoc extends mongoose.Document {
    _id?: string;
    id?: string;
    name: string;
    desc?: string;
    phone?: string;
    email?: string;
    website?: string;
    bio?: string;
    profile?: object;
    cover?: object;
    catalog?: string;
    kind: string;
    createdBy: string;
    acceptingCurrency: string;
    usdExchangeRateInRiel: number;
    deleted?: boolean;
    public?: boolean;
    address?: string;
    latitude?: number;
    longitude?: number;
}

const channelShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    desc: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    website: {
        type: String,
    },
    createdBy: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    profile: {
        type: Object,
    },
    cover: {
        type: Object,
    },
    kind: {
        type: Object,
        required: true
    },
    catalog: {
        type: SchemaTypes.ObjectId,
        ref: 'ChannelCatalog',
    },
    acceptingCurrency: {
        type: String,
        required: true,
    },
    usdExchangeRateInRiel: {
        type: Number,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    public: {
        type: Boolean,
        default: true
    },
    address: {
        type: String,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
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

channelShema.statics.build = (attrs: ChannelAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new Channel({
        _id,
        ...attrs
    });
};

const Channel = mongoose.model<ChannelDoc, ChannelModel>(
    'Channel', channelShema
);

export { Channel, ChannelAttrs, ChannelDoc }