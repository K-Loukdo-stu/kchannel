import * as mongoose from 'mongoose';
import { SchemaTypes } from 'mongoose';
import { ChannelRemarkFieldTypes } from '../channel.utils';

interface ChannelRemarkAttrs {
   id?: string;
   name: string;
   desc: string;
   channel: string;
   type: string;
   validationValues: string;
   isRequired: boolean;
   isEnable: boolean;
}

interface ChannelRemarkModel extends mongoose.Model<ChannelRemarkDoc> {
   build(attrs: ChannelRemarkAttrs): ChannelRemarkDoc;
}

interface ChannelRemarkDoc extends mongoose.Document {
   id: string;
   name: string;
   desc: string;
   channel: string;
   type: string;
   validationValues: string;
   isRequired: boolean;
   isEnable: boolean;
}

const channelRemarkSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   desc: {
      type: String,
   },
   validationValues: {
      type: [String],
   },
   isRequired: {
      type: Boolean,
      default: false
   },
   isEnable: {
      type: Boolean,
      default: true
   },
   type: {   // TEXT, SELECTION
      type: String,
      default: ChannelRemarkFieldTypes.TEXT
   },
   selectionOptions: {
      type: [String],
      default: [],
   },
   channel: {
      type: SchemaTypes.ObjectId,
      ref: "Channel",
      required: true
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

channelRemarkSchema.statics.build = (attrs: ChannelRemarkAttrs) => {
   const _id = attrs.id
   delete attrs.id
   return new ChannelRemark({
      _id,
      ...attrs
   });
};

const ChannelRemark = mongoose.model<ChannelRemarkDoc, ChannelRemarkModel>(
   'ChannelRemark', channelRemarkSchema
);

export { ChannelRemark, ChannelRemarkAttrs, ChannelRemarkDoc };

