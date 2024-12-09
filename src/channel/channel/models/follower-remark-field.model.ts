import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose';

interface FollowerRemarkFieldAttrs {
   id?: string;
   value: string;
   remark: string;
   user: string;
   channel: string;
}

interface FollowerRemarkFieldModel extends mongoose.Model<FollowerRemarkFieldDoc> {
   build(attrs: FollowerRemarkFieldAttrs): FollowerRemarkFieldDoc;
}

interface FollowerRemarkFieldDoc extends mongoose.Document {
   id: string;
   value: string;
   remark: string;
   user: string;
   channel: string;
}

const schema = new mongoose.Schema({
   value: {
      type: String,
   },
   remark: {
      type: SchemaTypes.ObjectId,
      ref: "ChannelRemark"
   },
   channel: {
      type: SchemaTypes.ObjectId,
      ref: "Channel",
      required: true
   },
   user: {
      type: SchemaTypes.ObjectId,
      ref: "User"
   }
}, {
   timestamps: true,
   toJSON: {
      transform(doc, ref) {
         ref.id = ref._id;
         delete ref._id;
         delete ref.__v;
      }
   }
});

schema.index({ user: 1, remark: 1 }, { unique: true });

schema.statics.build = (attrs: FollowerRemarkFieldAttrs) => {
   const _id = attrs.id
   delete attrs.id
   return new FollowerRemarkField({
      _id,
      ...attrs
   });
};

const FollowerRemarkField = mongoose.model<FollowerRemarkFieldDoc, FollowerRemarkFieldModel>(
   'FollowerRemarkField', schema
);

export { FollowerRemarkField, FollowerRemarkFieldAttrs, FollowerRemarkFieldDoc };

