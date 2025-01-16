import mongoose, { SchemaTypes } from "mongoose";

interface KLoukdoPromotionAttrs {
    id?: string;
    product: string;
    endDate: Date;
}

interface KLoukdoPromotionModel extends mongoose.Model<KLoukdoPromotionDoc> {
    build(attrs: KLoukdoPromotionAttrs): KLoukdoPromotionDoc;
}

interface KLoukdoPromotionDoc extends mongoose.Document {
    id?: string;
    product: string;
    endDate: Date;
}

const kLoukdoPromotionSchema = new mongoose.Schema({
    product: {
        type: SchemaTypes.ObjectId,
        ref: 'KLoukdoProduct',
    },
    endDate: {
        type: Date,
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
})

kLoukdoPromotionSchema.statics.build = (attrs: KLoukdoPromotionAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new KLoukdoPromotion({
        _id,
        ...attrs
    })
}

const KLoukdoPromotion = mongoose.model<KLoukdoPromotionDoc, KLoukdoPromotionModel>(
    'KLoukdoPromotion', kLoukdoPromotionSchema
);

export {KLoukdoPromotion, KLoukdoPromotionAttrs, KLoukdoPromotionDoc}