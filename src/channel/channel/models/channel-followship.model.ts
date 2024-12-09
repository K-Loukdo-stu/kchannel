import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

interface ChannelFollowshipAttrs {
  _id?: string;
  id?: string;
  channel: string;
  user: string;
  joinAt: number;
  addedBy: string;
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
}

interface ChannelFollowshipDoc extends mongoose.Document {
  _id?: string;
  id?: string;
  channel: string;
  user: string;
  joinAt: number;
  addedBy: string;
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
}

interface ChannelFollowshipModel extends mongoose.Model<ChannelFollowshipDoc> {
  build(attrs: ChannelFollowshipAttrs): ChannelFollowshipDoc;
}

const schema = new mongoose.Schema(
  {
    channel: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      // required: true
    },
    // Followship
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // required: true
    },
    joinAt: {
      type: Date,
      required: true
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // required: true
    },
    createdAt: {
      type: Date,
      required: true
    },
    updatedAt: {
      type: Date,
      required: true
    },
    deleted: {
      type: Boolean,
      default: false
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
  }
);


schema.index({ channel: 1, user: 1, addedBy: 1});
schema.index({ user: 1, channel: 1 }, { unique: true });

schema.statics.build = (attrs: ChannelFollowshipAttrs) => {
  const _id = attrs.id
  delete attrs.id
  return new ChannelFollowship({
    _id,
    ...attrs
  });
};

const ChannelFollowship = mongoose.model<ChannelFollowshipDoc, ChannelFollowshipModel>('ChannelFollowship', schema);

export { ChannelFollowship, ChannelFollowshipDoc, ChannelFollowshipAttrs };
