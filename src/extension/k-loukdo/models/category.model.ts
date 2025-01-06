import mongoose from "mongoose";

interface KLoukdoCategoryAttrs {
    id?: string;
    name: string;
    icon?: object;
}

interface KLoukdoCategoryModel extends mongoose.Model<KLoukdoCategoryDoc> {
    build(attrs: KLoukdoCategoryAttrs): KLoukdoCategoryDoc;
}

interface KLoukdoCategoryDoc extends mongoose.Document {
    id?: string;
    name: string;
    icon?: object;
}

const kLoukdoCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: Object,
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
})

kLoukdoCategorySchema.statics.build = (attrs: KLoukdoCategoryAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new KLoukdoCategory({
        _id,
        ...attrs
    })
}

const KLoukdoCategory = mongoose.model<KLoukdoCategoryDoc, KLoukdoCategoryModel>(
    'KLoukdoCategory', kLoukdoCategorySchema
);

export {KLoukdoCategory, KLoukdoCategoryAttrs, KLoukdoCategoryDoc}