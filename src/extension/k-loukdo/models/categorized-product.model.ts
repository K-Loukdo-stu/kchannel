// import mongoose, { SchemaTypes } from "mongoose";

// interface KLoukdoCategorizedProductAttrs {
//     id?: string;
//     product: string;
//     category: string;
//     subCategory: string;
// }

// interface KLoukdoCategorizedProductModel extends mongoose.Model<KLoukdoCategorizedProductDoc>{
//     build(attrs: KLoukdoCategorizedProductAttrs): KLoukdoCategorizedProductDoc;
// }

// interface KLoukdoCategorizedProductDoc extends mongoose.Document {
//     id?: string;
//     product: string;
//     category: string;
//     subCategory: string;
// }

// const kLoukdoCategorizedProductSchema = new mongoose.Schema({
//     product: {
//         type: SchemaTypes.ObjectId,
//         ref: 'Product',
//     },
//     category: {
//         type: SchemaTypes.ObjectId,
//         ref: 'KLoukdoCategory',
//     },
//     subCategory: {
//         type: SchemaTypes.ObjectId,
//         ref: 'KLoukdoSubCategory',
//     },
// },
//     {
//         timestamps: true,
//         toJSON: {
//             transform(doc, ret) {
//                 ret.id = ret._id;
//                 delete ret._id;
//                 delete ret.__v;
//             }
//         }
//     }
// )

// kLoukdoCategorizedProductSchema.statics.build = (attrs: KLoukdoCategorizedProductAttrs) => {
//     const _id = attrs.id
//     delete attrs.id
//     return new KLoukdoCategorizedProduct({
//         _id,
//         ...attrs
//     });
// }

// const KLoukdoCategorizedProduct = mongoose.model<KLoukdoCategorizedProductDoc, KLoukdoCategorizedProductModel>(
//     'KLoukdoCategorizedProduct', kLoukdoCategorizedProductSchema
// );

// export { KLoukdoCategorizedProduct, KLoukdoCategorizedProductAttrs, KLoukdoCategorizedProductDoc }