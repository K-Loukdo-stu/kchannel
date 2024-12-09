import * as mongoose from 'mongoose';

interface ExtensionAttrs {
    id?: string;
    name: string;
    keyname: string;
    desc: string;
}

interface ExtensionModel extends mongoose.Model<ExtensionDoc> {
    build(attrs: ExtensionAttrs): ExtensionDoc;
}

interface ExtensionDoc extends mongoose.Document {
    id?: string;
    name: string;
    keyname: string;
    desc: string;
}

const extensionShema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    keyname: {
        type: String,
        required: true
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

extensionShema.statics.build = (attrs: ExtensionAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new Extension({
        _id,
        ...attrs
    });
};

const Extension = mongoose.model<ExtensionDoc, ExtensionModel>(
    'Extension', extensionShema
);

export { Extension, ExtensionAttrs, ExtensionDoc };
