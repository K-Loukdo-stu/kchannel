import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose';

interface CardStatusMembershipAttrs {
   id?: string;
   attdSession: string;
   attendace: string;
   // cardMembership: string;
}

interface CardStatusMembershipModel extends mongoose.Model<CardStatusMembershipDoc> {
   build(atts: CardStatusMembershipAttrs): CardStatusMembershipDoc;
}

interface CardStatusMembershipDoc extends mongoose.Document {
   id?: string;
   attdSession: string;
   attendace: string;
   // cardMembership: string;
}

const cardStatusMembershipSchema = new mongoose.Schema({
   attdSession: {
      type: SchemaTypes.ObjectId,
      ref: 'AttdSession',
      required: true

   },

   attendace: {
      type: SchemaTypes.ObjectId,
      ref: 'Attendance',
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
})

cardStatusMembershipSchema.statics.build = (attrs: CardStatusMembershipAttrs) => {
   const _id = attrs.id
   delete attrs.id
   return new CardStatusMembership({
      _id,
      ...attrs
   })
};

const CardStatusMembership = mongoose.model<CardStatusMembershipDoc, CardStatusMembershipModel>(
   'CardStatusMembership', cardStatusMembershipSchema
)

export { CardStatusMembership, CardStatusMembershipAttrs, CardStatusMembershipDoc };
