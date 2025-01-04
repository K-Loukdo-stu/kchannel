import mongoose from "mongoose";

interface KLoukdoSubCategoryAttrs {
    id?: string;
    name: string;
    category: string;
    icon: string;
}

interface KLoukdoSubCategoryModel extends mongoose.Model<KLoukdoSubCategoryDoc> {
    build(attrs)
}

interface KLoukdoSubCategoryDoc extends mongoose.Document {
    id?: string;
    name: string;
    category: string
    icon?: string;
}

const kLoukdoSubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    icon: {
        type: String,
    }
})

kLoukdoSubCategorySchema.statics.build = (attrs: KLoukdoSubCategoryAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new KLoukdoSubCategory({
        _id,
        ...attrs
    })
}

const KLoukdoSubCategory = mongoose.model<KLoukdoSubCategoryDoc, KLoukdoSubCategoryModel>(
    'KLoukdoSubCategory', kLoukdoSubCategorySchema
);

export {KLoukdoSubCategory, KLoukdoSubCategoryAttrs, KLoukdoSubCategoryDoc}