import mongoose from "mongoose";

interface KLoukdoAdvertisementImageAttrs {
    id?: string;
    name: string;
    image: object;
    endDate: Date;
}

interface KLoukdoAdvertisementImageModel extends mongoose.Model<KLoukdoAdvertisementImageDoc> {
    build(attrs: KLoukdoAdvertisementImageAttrs): KLoukdoAdvertisementImageDoc;
}

interface KLoukdoAdvertisementImageDoc extends mongoose.Document {
    id?: string;
    name: string;
    image?: object;
    endDate: Date;

}

const kLoukdoAdvertisementImageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: Object
    },
    endDate: {
        type: Date,
        required: true
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
}
)

kLoukdoAdvertisementImageSchema.statics.build = (attrs: KLoukdoAdvertisementImageAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new KLoukdoAdvertisementImage({
        _id,
        ...attrs
    })
}

const KLoukdoAdvertisementImage = mongoose.model<KLoukdoAdvertisementImageDoc, KLoukdoAdvertisementImageModel>(
    'KLoukdoAdvertisementImage', kLoukdoAdvertisementImageSchema
);

export {KLoukdoAdvertisementImage, KLoukdoAdvertisementImageAttrs, KLoukdoAdvertisementImageDoc}