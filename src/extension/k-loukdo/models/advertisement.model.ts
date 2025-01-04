// import mongoose from "mongoose";

// interface AdvertisementAttrs {
//     id?: number;
//     product: String;
//     endDate: Date;
// }

// interface AdvertisementModel extends mongoose.Model<AdvertisementDoc> {
//     build(attrs: AdvertisementAttrs): AdvertisementDoc;
// }

// interface AdvertisementDoc extends mongoose.Document {
//     id?: number;
//     product: String;
//     endDate: Date;
// }

// const advertisementSchema = new mongoose.Schema({
//     product: {
//         type: String,
//         required: true,
//     },
//     endDate: {
//         type: Date,
//         required: true
//     },
    
// })

// advertisementSchema.statics.build = (attrs: AdvertisementAttrs) => {
//     const _id = attrs.id
//     delete attrs.id
//     return new Advertisement({
//         _id,
//         ...attrs
//     })
// }

// const Advertisement = mongoose.model<AdvertisementDoc, AdvertisementModel>(
//     'Advertisement', advertisementSchema
// );

// export {Advertisement, AdvertisementAttrs, AdvertisementDoc}