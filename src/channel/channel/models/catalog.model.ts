import * as mongoose from 'mongoose';

interface ChannelCatalogAttrs {
    id?: string;
    name: string;
    channelKind: string;
}

interface ChannelCatalogModel extends mongoose.Model<ChannelCatalogDoc> {
    build(attrs: ChannelCatalogAttrs): ChannelCatalogDoc;
}

interface ChannelCatalogDoc extends mongoose.Document {
    id?: string;
    name: string;
    channelKind: string;
}

const channelCatalogShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    channelKind: {
        type: String,
        required: true,
    },
},
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

channelCatalogShema.statics.build = (attrs: ChannelCatalogAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new ChannelCatalog({
        _id,
        ...attrs
    });
};

const ChannelCatalog = mongoose.model<ChannelCatalogDoc, ChannelCatalogModel>(
    'ChannelCatalog', channelCatalogShema
);

export { ChannelCatalog, ChannelCatalogAttrs, ChannelCatalogDoc }