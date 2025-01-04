// import mongoose from "mongoose";

// interface AdvertisementImageAttrs {
//     id?: number;
//     advertisement: number;
//     image: Object;
// }

// interface AdvertisementImageModel extends mongoose.Model<AdvertisementImageDoc> {
//     build(attrs: AdvertisementImageAttrs): AdvertisementImageDoc;
// }

// interface AdvertisementImageDoc extends mongoose.Document {
//     id?: number;
//     advertisement: number;
//     image: Object;
// }

// const advertisementImageSchema = new mongoose.Schema({
//     advertisement: {
//         type: String,
//         required: true,
//     },
//     image: {
//         type: Object,
//         required: true
//     }
// },
// {
//     timestamps: true,
//     toJSON: {
//         transform(doc, ret) {
//             ret.id = ret._id;
//             delete ret._id;
//             delete ret.__v;
//         }
//     }
// }
// )

// advertisementImageSchema.statics.build = (attrs: AdvertisementImageAttrs) => {
//     const _id = attrs.id
//     delete attrs.id
//     return new AdvertisementImage({
//         _id,
//         ...attrs
//     })
// }

// const AdvertisementImage = mongoose.model<AdvertisementImageDoc, AdvertisementImageModel>(
//     'AdvertisementImage', advertisementImageSchema
// );

// export {AdvertisementImage, AdvertisementImageAttrs, AdvertisementImageDoc}